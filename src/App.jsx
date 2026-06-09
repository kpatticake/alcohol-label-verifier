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
  Alert
} from "@mui/material";

import { useState } from "react";

function App() {

  const [strictMode, setStrictMode] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("");
  const [alcoholVolume, setAlcoholVolume] = useState("");
  const [netContents, setNetContents] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrText, setOCRText] = useState("");
  const [verificationResults, setVerificationResults] = useState([]);

  function handleVerifyLabel() {
    console.log("Verify Label clicked");
    console.log({
      brandName,
      productType,
      alcoholVolume,
      netContents
    });

    setNotificationOpen(true);

    // Validate inputs

    // Run OCR on uploaded image

    // Normalize extracted text

    // Compare fields

    // Check government warning

    // Generate results

    // Display results
  }

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
              <Typography variant="h4" component="h1" gutterBottom>
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
                      <Switch
                          checked={strictMode}
                          onChange={(event) => setStrictMode(event.target.checked)}
                      />
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

              <Button variant="outlined" component="label">
                Upload Label Image
                <input type="file" hidden accept="image/*" />
              </Button>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" size="large" onClick={handleVerifyLabel}>
                  Verify Label
                </Button>

                <Button variant="outlined" size="large" onClick={handleClearForm}>
                  Clear Form
                </Button>
              </Stack>

            </Stack>
          </Stack>
        </Paper>

        <Snackbar open={notificationOpen} autoHideDuration={3000} onClose={() => setNotificationOpen(false)}>
          <Alert severity="info" onClose={() => setNotificationOpen(false)}>
            Verification started.
          </Alert>
        </Snackbar>
      </Box>
  );
}

export default App;
