import palette from "./custom/palette";
import { createTheme } from "@mui/material/styles";

export const Theme = createTheme({
	palette: palette,
	typography: {
		fontFamily: ["Open Sans", "sans-serif", "Roboto", "Helvetica", "Arial"].join(","),
	},
});

export default Theme;
