import { makeStyles } from "tss-react/mui";
import Container from "@mui/material/Container";

const useStyles = makeStyles()((theme) => ({
	root: {
		paddingTop: "80px",
		paddingBottom: "80px",
		backgroundColor: "#fff",
	},
}));

export default function IssueList() {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Container maxWidth="md"></Container>
		</div>
	);
}
