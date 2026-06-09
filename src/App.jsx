import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

function App() {
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

            <Stack spacing={2}>
              <TextField label="Brand Name" fullWidth />
              <TextField label="Alcohol By Volume (ABV)" fullWidth />
              <TextField label="Product Type" fullWidth />

              <Button variant="outlined" component="label">
                Upload Label Image
                <input type="file" hidden accept="image/*" />
              </Button>

              <Button variant="contained" size="large">
                Verify Label
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
  );
}

export default App;
