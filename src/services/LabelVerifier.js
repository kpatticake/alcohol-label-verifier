// ========================================
// Public API
// ========================================

export function verifyLabel(applicationData, ocrText, strictMode) {
    return [
        checkField("Brand Name", applicationData.brandName, ocrText, strictMode),
        checkField("Product Type", applicationData.productType, ocrText, strictMode),
        checkField("Alcohol By Volume", applicationData.alcoholVolume, ocrText, strictMode),
        checkField("Net Contents", applicationData.netContents, ocrText, strictMode),
        checkGovernmentWarning(ocrText)
    ];
}

// ========================================
// Private Helper Functions
// ========================================

function checkField(fieldName, expectedValue, ocrText, strictMode) {
    const cleanedExpectedValue = expectedValue.trim();
    const normalizedOcrText = normalizeText(ocrText);
    const normalizedExpectedValue = normalizeText(expectedValue);

    if (strictMode) {
        return {
            field: fieldName,
            expected: expectedValue,
            passed:
                cleanedExpectedValue !== "" &&
                ocrText.includes(cleanedExpectedValue)
        };
    }

    return {
        field: fieldName,
        expected: expectedValue,
        passed:
            normalizedExpectedValue !== "" &&
            normalizedOcrText.includes(normalizedExpectedValue)
    };
}

function checkGovernmentWarning(ocrText) {
    const normalizedText = ocrText.toLowerCase();
    return {
        field: "Government Warning",
        expected: "Present",
        passed:
            normalizedText.includes("government warning") &&
            normalizedText.includes("surgeon general")
    };
}

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s.%/]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
