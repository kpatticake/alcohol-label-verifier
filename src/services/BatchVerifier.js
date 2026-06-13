import Tesseract from "tesseract.js";
import { verifyLabel } from "./LabelVerifier.js";

// Runs OCR and verification for every row in the uploaded batch CSV.
export async function verifyBatchLabels(batchCsvFile, batchImageFiles, strictMode, onProgress, onResultsUpdated) {
    const csvText = await readFileAsText(batchCsvFile);
    const batchRows = parseBatchCsv(csvText);

    if (batchRows.length === 0) {
        return [];
    }

    const imageFileMap = createImageFileMap(batchImageFiles);
    const completedResults = [];

    for (let index = 0; index < batchRows.length; index += 1) {
        const batchRow = batchRows[index];
        const rowNumber = index + 1;

        onProgress(`Processing row ${rowNumber} of ${batchRows.length}: ${batchRow.imageFileName}`);

        const matchingImageFile = imageFileMap.get(batchRow.imageFileName.toLowerCase());

        if (matchingImageFile === undefined) {
            completedResults.push({
                ...batchRow,
                status: "Missing Image",
                passed: false,
                passedCount: 0,
                totalCount: 5,
                fieldResults: [],
                errorMessage: `No uploaded image matched ${batchRow.imageFileName}.`
            });

            onResultsUpdated([...completedResults]);
            continue;
        }

        try {
            const ocrResult = await Tesseract.recognize(matchingImageFile, "eng");
            const extractedText = ocrResult.data.text;

            const fieldResults = verifyLabel(
                {
                    brandName: batchRow.brandName,
                    productType: batchRow.productType,
                    alcoholVolume: batchRow.alcoholVolume,
                    netContents: batchRow.netContents
                },
                extractedText,
                strictMode
            );

            const passedCount = fieldResults.filter((result) => result.passed).length;

            completedResults.push({
                ...batchRow,
                status: "Processed",
                passed: passedCount === fieldResults.length,
                passedCount: passedCount,
                totalCount: fieldResults.length,
                fieldResults: fieldResults,
                errorMessage: ""
            });

            onResultsUpdated([...completedResults]);
        }
        catch (error) {
            console.error(error);

            completedResults.push({
                ...batchRow,
                status: "OCR Error",
                passed: false,
                passedCount: 0,
                totalCount: 5,
                fieldResults: [],
                errorMessage: "Unable to read text from this image."
            });

            onResultsUpdated([...completedResults]);
        }
    }

    return completedResults;
}

function createImageFileMap(imageFiles) {
    const imageFileMap = new Map();

    imageFiles.forEach((imageFile) => {
        imageFileMap.set(imageFile.name.toLowerCase(), imageFile);
    });

    return imageFileMap;
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsText(file);
    });
}

function parseBatchCsv(csvText) {
    const lines = csvText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

    if (lines.length === 0) {
        return [];
    }

    const firstColumns = splitCsvLine(lines[0]);
    const firstColumnName = firstColumns[0].toLowerCase().replace(/\s+/g, "");
    const hasHeaderRow = firstColumnName === "brandname";
    const dataLines = hasHeaderRow ? lines.slice(1) : lines;

    return dataLines.map((line, index) => {
        const columns = splitCsvLine(line);

        return {
            csvRowNumber: hasHeaderRow ? index + 2 : index + 1,
            brandName: columns[0] !== undefined ? columns[0].trim() : "",
            productType: columns[1] !== undefined ? columns[1].trim() : "",
            alcoholVolume: columns[2] !== undefined ? columns[2].trim() : "",
            netContents: columns[3] !== undefined ? columns[3].trim() : "",
            imageFileName: columns[4] !== undefined ? columns[4].trim() : ""
        };
    });
}

function splitCsvLine(line) {
    const values = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        const nextCharacter = line[index + 1];

        if (character === '"' && nextCharacter === '"') {
            currentValue += '"';
            index += 1;
        }
        else if (character === '"') {
            insideQuotes = !insideQuotes;
        }
        else if (character === "," && insideQuotes === false) {
            values.push(currentValue.trim());
            currentValue = "";
        }
        else {
            currentValue += character;
        }
    }

    values.push(currentValue.trim());
    return values;
}
