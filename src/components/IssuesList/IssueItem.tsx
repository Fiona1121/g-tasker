import { useContext, useState } from "react";
import moment from "moment";
import _ from "lodash";

import { makeStyles } from "tss-react/mui";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";
import GithubAPI from "../../api/GithubAPI";

interface Props {
	issue: any;
	init: () => void;
	setEditIssue: (issue: any) => void;
}

const useStyles = makeStyles()((theme) => ({
	issueWrapper: {
		textAlign: "left",
		marginRight: "7%",
		marginLeft: "7%",
		marginBottom: "20px",
	},
	issueHeader: {
		backgroundColor: "#f0f0f0",
		borderBottom: "1px solid #ddd",
	},
	issueTitle: {
		lineHeight: "37px",
		fontWeight: 700,
		marginBottom: "10px",
	},
	issueSummary: {
		lineHeight: "144%",
		marginBottom: "14px",
		fontSize: "16px",
		fontFamily: "Merriweather",
	},
}));

export default function IssueItem({ issue, init, setEditIssue }: Props) {
	const { classes } = useStyles();
	const { state, dispatch } = useContext(AuthContext);

	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

	const owner = issue.repository_url.split("/")[issue.repository_url.split("/").length - 2];
	const repo = issue.repository_url.split("/")[issue.repository_url.split("/").length - 1];
	const title = issue.title;
	const body = issue.body;
	const status =
		_.filter(
			issue.labels,
			(label) => label.name === "Open" || label.name === "Done" || label.name === "In Progress"
		)[0]?.name ?? "";

	const getLabelChip = (status: string) => {
		switch (status) {
			case "Open":
				return <Chip label="Open" color="success" variant="outlined" style={{ marginRight: "5px" }} />;
			case "Done":
				return <Chip label="Done" color="info" variant="outlined" style={{ marginRight: "5px" }} />;
			case "In Progress":
				return <Chip label="In Progress" color="warning" variant="outlined" style={{ marginRight: "5px" }} />;
			default:
				return;
		}
	};

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setMenuAnchorEl(event.currentTarget);
	};

	const handleEditClick = () => {
		setMenuAnchorEl(null);
		setEditIssue(issue);
	};

	const handleDeleteClick = async () => {
		setMenuAnchorEl(null);
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await GithubAPI.patchIssue(state.access_token, issue.url, {
			state: "closed",
		})
			.then((res) => {
				if (res.ok) {
					toast.success("Issue closed successfully!");
					setTimeout(() => {
						init();
					}, 1000);
				} else if (res.status === 403) {
					toast.error("You don't have permission to edit this issue");
				} else {
					toast.error("Issue closed failed! Please try again later.");
				}
			})
			.catch((err) => console.log(err));
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	};

	return (
		<Card variant="outlined" className={classes.issueWrapper}>
			<CardHeader
				avatar={<Avatar src={issue.user?.avatar_url}></Avatar>}
				action={
					<Box>
						{getLabelChip(status)}
						<IconButton aria-label="settings" onClick={handleMenuClick}>
							<MoreVertIcon />
						</IconButton>
					</Box>
				}
				title={issue.user?.login}
				subheader={
					<Typography variant="caption" component="p" style={{ color: "#555" }}>
						{moment(issue.created_at).format("MMMM D, YYYY")}
					</Typography>
				}
				className={classes.issueHeader}
			/>
			<CardContent>
				<Typography variant="h6" component="h6" className={classes.issueTitle}>
					<span style={{ color: "#777" }}>
						{owner}/{repo}
					</span>{" "}
					{title}
				</Typography>
				<Typography
					variant="body1"
					component="p"
					className={classes.issueSummary}
					dangerouslySetInnerHTML={{ __html: body }}
				></Typography>
			</CardContent>
			<Menu
				anchorEl={menuAnchorEl}
				keepMounted
				open={Boolean(menuAnchorEl)}
				onClose={() => setMenuAnchorEl(null)}
			>
				<MenuItem onClick={handleEditClick}>
					<ListItemIcon>
						<EditIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Edit" />
				</MenuItem>
				<MenuItem onClick={handleDeleteClick}>
					<ListItemIcon>
						<DeleteIcon fontSize="small" />
					</ListItemIcon>
					<ListItemText primary="Delete" />
				</MenuItem>
			</Menu>
		</Card>
	);
}
