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
  Divider
} from "@mui/material";
import { useState } from "react";
import Tesseract from "tesseract.js";
import { verifyLabel } from "./services/LabelVerifier.js";

function App() {
  const [strictMode, setStrictMode] = useState(false);
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

  // Reset form fields, OCR output, and verification results
  function handleClearForm() {
    setBrandName("");
    setProductType("");
    setAlcoholVolume("");
    setNetContents("");
    setSelectedFile(null);
    setOCRText("");
    setVerificationResults([]);
  }

  return (
      <Box sx={{minHeight: "100vh", width: "100%", p: { xs: 2, sm: 3, md: 4 }, boxSizing: "border-box"}}>
        <Paper elevation={3} sx={{width: "100%", p: { xs: 2, sm: 3, md: 4 }, boxSizing: "border-box"}}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ color: "black"}}>
                Alcohol Label Verification
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Upload an alcohol label image and compare it against submitted product information.
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

            <Stack spacing={2}>
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
                      onChange={(event) => setSelectedFile(event.target.files[0])}
                  />
                </Button>

                <Button variant="outlined" component="label" sx={{display: { xs: "inline-flex", sm: "none" }}}>
                  Take Photo
                  <input
                      type="file"
                      hidden
                      accept="image/*"
                      capture="environment"
                      onChange={(event) => setSelectedFile(event.target.files[0])}
                  />
                </Button>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" size="large" onClick={handleVerifyLabel} disabled={isProcessing}>
                  {isProcessing ? "Reading Label..." : "Verify Label"}
                </Button>

                <Button variant="outlined" size="large" onClick={handleClearForm}>
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
