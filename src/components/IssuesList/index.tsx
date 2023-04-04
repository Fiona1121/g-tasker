import { makeStyles } from "tss-react/mui";
import Container from "@mui/material/Container";
import _ from "lodash";
import IssueItem from "./IssueItem";

interface Props {
	issues: any[];
	reload: () => void;
}

const useStyles = makeStyles()((theme) => ({
	root: {
		paddingTop: "80px",
		paddingBottom: "80px",
		backgroundColor: "#fff",
	},
}));

export default function IssueList({ issues, reload }: Props) {
	const { classes } = useStyles();

	return (
		<div className={classes.root}>
			<Container maxWidth="md">
				{_.map(issues, (issue) => {
					return <IssueItem issue={issue} reload={reload} />;
				})}
			</Container>
		</div>
	);
}
