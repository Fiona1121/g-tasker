import palette from "./custom/palette";
import { createTheme } from "@mui/material/styles";

export const Theme = createTheme({
	palette: palette,
	typography: {
		fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
	},
});

export default Theme;
