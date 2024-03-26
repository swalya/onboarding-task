import { createTheme } from "@mui/material/styles";
import { green, red } from "@mui/material/colors";
const appTheme = createTheme({
  palette: {
    background: { default: "#f5fdfc" },
    text: { primary: "#000000" },
    primary: { main: "#4a26fd" },
    secondary: { main: "#dd0074" },
    error: { main: red.A400 },
    success: { main: green.A400 },
  },
});
export default appTheme;