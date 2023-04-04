import { makeStyles } from "tss-react/mui";
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles()((theme) => ({
	root: {},
	headerSection: {
		paddingTop: "80px",
		paddingBottom: "80px",
		borderBottom: "1px solid #ddd",
		backgroundColor: "#f0f0f0",
		textAlign: "center",
		[theme.breakpoints.down("md")]: {
			paddingTop: "60px",
			paddingBottom: "60px",
		},
		[theme.breakpoints.down("sm")]: {
			paddingTop: "40px",
			paddingBottom: "40px",
		},
	},
	headerTitle: {
		marginBottom: "10px",
		color: "#555",
	},
	headerSearch: {
		maxWidth: "600px",
		margin: "0 auto",
	},
}));

export default function Header() {
	const { classes } = useStyles();

	return (
		<div className={classes.headerSection}>
			<Container maxWidth="md">
				<div className={classes.headerTitle}>
					<Typography variant="h3" component="h3" sx={{ fontWeight: 600 }}>
						G-Tasker
					</Typography>
				</div>
				<div className={classes.headerSearch}>
					<Autocomplete
						id="Search for issues..."
						freeSolo
						options={[]}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Search"
								placeholder="Search for tasks..."
								variant="outlined"
								size="small"
							/>
						)}
					/>
				</div>
			</Container>
		</div>
	);
}
