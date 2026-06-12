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

    if (strictMode) {
        return {
            field: fieldName,
            expected: expectedValue,
            passed:
                cleanedExpectedValue !== "" &&
                ocrText.includes(cleanedExpectedValue)
        };
    }

    const normalizedOcrText = normalizeText(ocrText);
    const normalizedExpectedValue = normalizeText(expectedValue);

    return {
        field: fieldName,
        expected: expectedValue,
        passed:
            normalizedExpectedValue !== "" &&
            normalizedOcrText.includes(normalizedExpectedValue)
    };
}

function checkGovernmentWarning(ocrText) {
    return {
        field: "Government Warning",
        expected: "Present",
        passed:
            ocrText.includes("GOVERNMENT WARNING:") &&
            ocrText.includes("Surgeon General")
    };
}

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s.%/]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
