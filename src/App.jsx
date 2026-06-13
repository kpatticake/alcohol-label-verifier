import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Collapse,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { useState } from "react";
import Tesseract from "tesseract.js";
import { verifyLabel } from "./services/LabelVerifier.js";
import { verifyBatchLabels } from "./services/BatchVerifier.js";

function App() {
  const [strictMode, setStrictMode] = useState(false);
  const [verificationMode, setVerificationMode] = useState("single");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("");
  const [alcoholVolume, setAlcoholVolume] = useState("");
  const [netContents, setNetContents] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrText, setOCRText] = useState("");
  const [showOcrText, setShowOcrText] = useState(false);
  const [verificationResults, setVerificationResults] = useState([]);

  const [batchCsvFile, setBatchCsvFile] = useState(null);
  const [batchImageFiles, setBatchImageFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [batchProgressMessage, setBatchProgressMessage] = useState("");
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  function handleVerificationModeChange(event, newVerificationMode) {
    if (newVerificationMode !== null) {
      setVerificationMode(newVerificationMode);
    }
  }

  // Performs OCR on the selected image and compares
  // extracted label data against user-entered values.
  async function handleVerifyLabel() {
    if (selectedFile === null) {
      setNotificationMessage("Please select an image.");
      setNotificationOpen(true);
      return;
    }

    setIsProcessing(true);
    setNotificationMessage("Reading label text...");
    setNotificationOpen(true);

    try {
      // Extract text from the uploaded label image
      const result = await Tesseract.recognize(selectedFile, "eng");
      const extractedText = result.data.text;

      setOCRText(extractedText);

      // Compare OCR text against application data
      const results = verifyLabel({brandName, productType, alcoholVolume, netContents}, extractedText, strictMode);
      setVerificationResults(results);

      const passedCount = results.filter((result) => result.passed).length;
      setNotificationMessage(`Verification complete: ${passedCount} of ${results.length} fields matched.`);
      setNotificationOpen(true);
    }
    catch (error) {
      console.error(error);
      setNotificationMessage("Unable to read text from the image.");
      setNotificationOpen(true);
    }
    finally {
      setIsProcessing(false);
    }
  }

  // Runs OCR and verification for each row in a batch CSV file.
  async function handleBatchVerify() {
    if (batchCsvFile === null) {
      setNotificationMessage("Please select a batch CSV file.");
      setNotificationOpen(true);
      return;
    }

    if (batchImageFiles.length === 0) {
      setNotificationMessage("Please select one or more batch label images.");
      setNotificationOpen(true);
      return;
    }

    setIsBatchProcessing(true);
    setBatchResults([]);
    setBatchProgressMessage("Reading batch CSV...");
    setNotificationMessage("Starting batch verification...");
    setNotificationOpen(true);

    try {
      const completedResults = await verifyBatchLabels(
          batchCsvFile,
          batchImageFiles,
          strictMode,
          setBatchProgressMessage,
          setBatchResults
      );

      if (completedResults.length === 0) {
        setNotificationMessage("The CSV file did not contain any rows.");
        setNotificationOpen(true);
        setBatchProgressMessage("");
        return;
      }

      setBatchProgressMessage("Batch verification complete.");
      setNotificationMessage(`Batch verification complete: ${completedResults.length} row(s) processed.`);
      setNotificationOpen(true);
    }
    catch (error) {
      console.error(error);
      setNotificationMessage("Unable to process the batch CSV file.");
      setNotificationOpen(true);
      setBatchProgressMessage("");
    }
    finally {
      setIsBatchProcessing(false);
    }
  }

  // Reset form fields, OCR output, and verification results
  function handleClearForm() {
    setBrandName("");
    setProductType("");
    setAlcoholVolume("");
    setNetContents("");
    setSelectedFile(null);
    setOCRText("");
    setShowOcrText(false);
    setVerificationResults([]);
    setBatchCsvFile(null);
    setBatchImageFiles([]);
    setBatchResults([]);
    setBatchProgressMessage("");
  }

  function handleSingleImageSelected(event) {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }

  function handleBatchCsvSelected(event) {
    if (event.target.files.length > 0) {
      setBatchCsvFile(event.target.files[0]);
      setBatchResults([]);
      setBatchProgressMessage("");
    }
  }

  function handleBatchImagesSelected(event) {
    if (event.target.files.length > 0) {
      setBatchImageFiles(Array.from(event.target.files));
      setBatchResults([]);
      setBatchProgressMessage("");
    }
  }

  return (
      <Box sx={{minHeight: "100vh", width: "100%", p: { xs: 2, sm: 3, md: 4 }, boxSizing: "border-box"}}>
        <Paper elevation={3} sx={{width: "100%", p: { xs: 2, sm: 3, md: 4 }, boxSizing: "border-box"}}>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                  component="img"
                  src="/alcohol_verify.png"
                  alt="Alcohol Label Verification"
                  sx={{width: 80, height: 80, objectFit: "contain", mb: 1}}
              />

              <Typography variant="h4" component="h1" gutterBottom sx={{ color: "black" }}>
                Alcohol Label Verification
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Verify a single label image or run a CSV-based batch verification.
              </Typography>
            </Box>

            <Paper variant="outlined" sx={{p: 2}}>
              <Stack spacing={1}>
                <FormControlLabel
                    control={
                      <Switch checked={strictMode} onChange={(event) => setStrictMode(event.target.checked)}/>
                    }
                    label="Strict Compliance Mode"
                />

                <Typography variant="body2" color="text.secondary">
                  {strictMode
                      ? "Exact text matching. Capitalization, punctuation, and spacing differences will be treated as mismatches."
                      : "Loose matching. Capitalization, punctuation, and spacing differences will be ignored when comparing label data."}
                </Typography>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Verification Mode
                </Typography>

                <ToggleButtonGroup
                    value={verificationMode}
                    exclusive
                    onChange={handleVerificationModeChange}
                    fullWidth
                >
                  <ToggleButton value="single" disabled={isProcessing || isBatchProcessing} sx={{ flex: 1 }}>
                    Single Label
                  </ToggleButton>

                  <ToggleButton value="batch" disabled={isProcessing || isBatchProcessing} sx={{ flex: 1 }}>
                    Batch CSV
                  </ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Paper>

            {verificationMode === "single" && (
                <Stack spacing={2}>
                  <Typography variant="h6">
                    Single Label Verification
                  </Typography>

                  <TextField label="Brand Name" value={brandName} onChange={(event) => setBrandName(event.target.value)} fullWidth/>
                  <TextField label="Product Type" value={productType} onChange={(event) => setProductType(event.target.value)} fullWidth />
                  <TextField label="Alcohol By Volume (ABV)" value={alcoholVolume} onChange={(event) => setAlcoholVolume(event.target.value)} fullWidth />
                  <TextField label="Net Contents" value={netContents} onChange={(event) => setNetContents(event.target.value)} fullWidth />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button variant="outlined" component="label" fullWidth>
                      Upload Label Image
                      <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleSingleImageSelected}
                      />
                    </Button>

                    <Button variant="outlined" component="label" sx={{display: { xs: "inline-flex", sm: "none" }}}>
                      Take Photo
                      <input
                          type="file"
                          hidden
                          accept="image/*"
                          capture="environment"
                          onChange={handleSingleImageSelected}
                      />
                    </Button>
                  </Stack>

                  {selectedFile !== null && (
                      <Typography variant="body2">
                        Image selected: {selectedFile.name}
                      </Typography>
                  )}

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button variant="contained" size="large" onClick={handleVerifyLabel} disabled={isProcessing || isBatchProcessing}>
                      {isProcessing ? "Reading Label..." : "Verify Label"}
                    </Button>

                    <Button variant="outlined" size="large" onClick={handleClearForm} disabled={isProcessing || isBatchProcessing}>
                      Clear Form
                    </Button>
                  </Stack>

                  {/* Verification summary displayed after a label is processed */}
                  {verificationResults.length > 0 && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Verification Results
                        </Typography>

                        <Stack spacing={1}>
                          {verificationResults.map((result) => (
                              <Typography key={result.field}>
                                {result.passed ? "✅" : "❌"} {result.field}:{" "}
                                {result.passed ? "Match" : "No Match"}
                              </Typography>
                          ))}
                        </Stack>
                      </Paper>
                  )}

                  {/* Optional section to review raw OCR output */}
                  {ocrText !== "" && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={2}>
                          <Button
                              variant="text"
                              onClick={() => setShowOcrText(!showOcrText)}
                          >
                            {showOcrText ? "Hide Extracted Text" : "Show Extracted Text"}
                          </Button>

                          <Collapse in={showOcrText}>
                            <Stack spacing={2}>
                              <Divider />

                              <Typography variant="h6">
                                Extracted Label Text
                              </Typography>

                              <Typography
                                  variant="body2"
                                  sx={{
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "monospace"
                                  }}
                              >
                                {ocrText}
                              </Typography>
                            </Stack>
                          </Collapse>
                        </Stack>
                      </Paper>
                  )}
                </Stack>
            )}

            {verificationMode === "batch" && (
                <Stack spacing={2}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      <Typography variant="h6">
                        Batch Verification
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Upload a CSV file and the matching label images. The CSV image filename must match one of the uploaded image filenames.
                      </Typography>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button variant="outlined" component="label" fullWidth>
                          Upload Batch CSV
                          <input
                              type="file"
                              hidden
                              accept=".csv,text/csv"
                              onChange={handleBatchCsvSelected}
                          />
                        </Button>

                        <Button variant="outlined" component="label" fullWidth>
                          Upload Batch Images
                          <input
                              type="file"
                              hidden
                              accept="image/*"
                              multiple
                              onChange={handleBatchImagesSelected}
                          />
                        </Button>
                      </Stack>

                      {batchCsvFile !== null && (
                          <Typography variant="body2">
                            CSV selected: {batchCsvFile.name}
                          </Typography>
                      )}

                      {batchImageFiles.length > 0 && (
                          <Typography variant="body2">
                            Images selected: {batchImageFiles.length}
                          </Typography>
                      )}

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Button variant="contained" onClick={handleBatchVerify} disabled={isProcessing || isBatchProcessing}>
                          {isBatchProcessing ? "Processing Batch..." : "Run Batch Verification"}
                        </Button>

                        <Button variant="outlined" onClick={handleClearForm} disabled={isProcessing || isBatchProcessing}>
                          Clear Form
                        </Button>
                      </Stack>

                      {batchProgressMessage !== "" && (
                          <Typography variant="body2" color="text.secondary">
                            {batchProgressMessage}
                          </Typography>
                      )}
                    </Stack>
                  </Paper>

                  {/* Batch verification summary displayed after batch processing */}
                  {batchResults.length > 0 && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Batch Verification Results
                        </Typography>

                        <Stack spacing={2}>
                          {batchResults.map((batchResult) => (
                              <Paper key={batchResult.csvRowNumber} variant="outlined" sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                  <Typography>
                                    {batchResult.passed ? "✅" : "❌"} CSV Row {batchResult.csvRowNumber}: {batchResult.brandName}
                                  </Typography>

                                  <Typography variant="body2" color="text.secondary">
                                    Image: {batchResult.imageFileName}
                                  </Typography>

                                  <Typography variant="body2" color="text.secondary">
                                    Status: {batchResult.status}
                                  </Typography>

                                  {batchResult.errorMessage !== "" && (
                                      <Typography variant="body2" color="error">
                                        {batchResult.errorMessage}
                                      </Typography>
                                  )}

                                  {batchResult.fieldResults.length > 0 && (
                                      <Stack spacing={0.5}>
                                        <Typography variant="body2">
                                          Field matches: {batchResult.passedCount} of {batchResult.totalCount}
                                        </Typography>

                                        {batchResult.fieldResults.map((fieldResult) => (
                                            <Typography key={fieldResult.field} variant="body2">
                                              {fieldResult.passed ? "✅" : "❌"} {fieldResult.field}: {fieldResult.passed ? "Match" : "No Match"}
                                            </Typography>
                                        ))}
                                      </Stack>
                                  )}
                                </Stack>
                              </Paper>
                          ))}
                        </Stack>
                      </Paper>
                  )}
                </Stack>
            )}
          </Stack>
        </Paper>

        {/* User notifications and status messages */}
        <Snackbar open={notificationOpen} autoHideDuration={3000} onClose={() => setNotificationOpen(false)}>
          <Alert severity="info" onClose={() => setNotificationOpen(false)}>
            {notificationMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
}

export default App;
