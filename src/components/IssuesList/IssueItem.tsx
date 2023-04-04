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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircleIcon from "@mui/icons-material/Circle";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

interface Props {
	issue: any;
	reload: () => void;
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
	dialogHeader: {
		borderBottom: "1px solid #ddd",
	},
	dialogContent: {
		paddingBottom: "40px",
	},
	dialogActions: {
		borderTop: "1px solid #ddd",
	},
}));

export default function IssueItem({ issue, reload }: Props) {
	const { classes } = useStyles();
	const { state, dispatch } = useContext(AuthContext);

	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const owner = issue.repository_url.split("/")[issue.repository_url.split("/").length - 2];
	const repo = issue.repository_url.split("/")[issue.repository_url.split("/").length - 1];
	const title = issue.title;
	const body = issue.body;
	const status =
		_.filter(
			issue.labels,
			(label) => label.name === "Open" || label.name === "Done" || label.name === "In Progress"
		)[0]?.name ?? "";

	const [editTitle, setEditTitle] = useState(title);
	const [editBody, setEditBody] = useState(body);
	const [editStatus, setEditStatus] = useState(status);

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
		setEditDialogOpen(true);
	};

	const handleDeleteClick = async () => {
		setMenuAnchorEl(null);
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await fetch(issue.url, {
			method: "PATCH",
			headers: {
				Authorization: `token ${state.access_token}`,
				Accept: "application/vnd.github.v3+json",
			},
			body: JSON.stringify({
				state: "closed",
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					toast.success("Issue closed successfully!");
					reload();
				} else if (res.status === 403) {
					toast.error("You don't have permission to edit this issue");
				} else {
					toast.error("Issue closed failed! Please try again later.");
				}
			})
			.catch((err) => console.log(err));
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	};

	const cancelEdit = () => {
		setEditTitle(issue.title);
		setEditBody(issue.body);
		setEditStatus(
			_.filter(
				issue.labels,
				(label) => label.name === "Open" || label.name === "Done" || label.name === "In Progress"
			)[0]?.name ?? ""
		);
		setEditDialogOpen(false);
	};

	const saveEdit = async () => {
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await fetch(issue.url, {
			method: "PATCH",
			headers: {
				Authorization: `token ${state.access_token}`,
				Accept: "application/vnd.github.v3+json",
			},
			body: JSON.stringify({
				title: editTitle,
				body: editBody,
				labels: [editStatus],
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					toast.success("Issue updated successfully!");
					reload();
				} else if (res.status === 403) {
					toast.error("You don't have permission to edit this issue");
				} else {
					toast.error("Issue update failed! Please try again later.");
				}
			})
			.catch((err) => console.log(err));
		setEditDialogOpen(false);
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	};

	return (
		<>
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
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
				<DialogContent className={classes.dialogContent}>
					<Typography variant="h5" component="h5" style={{ fontWeight: 600 }}>
						{owner}/{repo}
					</Typography>
					<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
						Title
					</Typography>
					<TextField
						margin="dense"
						id="title"
						type="text"
						fullWidth
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						InputProps={{
							startAdornment: <InputAdornment position="start">#{issue.number}</InputAdornment>,
						}}
					/>
					<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
						Body
					</Typography>
					<TextField
						margin="dense"
						id="body"
						type="text"
						fullWidth
						multiline
						rows={10}
						value={editBody}
						onChange={(e) => setEditBody(e.target.value)}
					/>
					<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
						Status
					</Typography>
					<Select
						onChange={(e) => setEditStatus(e.target.value)}
						value={editStatus}
						style={{ marginTop: "8px", minWidth: "250px" }}
					>
						<MenuItem value="Open">
							<Box sx={{ display: "flex" }}>
								<CircleIcon color="success" style={{ marginRight: "10px" }} fontSize="small" />
								<Typography variant="body1" component="span">
									Open
								</Typography>
							</Box>
						</MenuItem>
						<MenuItem value="In Progress">
							<Box sx={{ display: "flex" }}>
								<CircleIcon color="warning" style={{ marginRight: "10px" }} fontSize="small" />
								<Typography variant="body1" component="span">
									In Progress
								</Typography>
							</Box>
						</MenuItem>
						<MenuItem value="Done">
							<Box sx={{ display: "flex" }}>
								<CircleIcon color="info" style={{ marginRight: "10px" }} fontSize="small" />
								<Typography variant="body1" component="span">
									Done
								</Typography>
							</Box>
						</MenuItem>
					</Select>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={cancelEdit}>Cancel</Button>
					<Button onClick={saveEdit}>Save</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
