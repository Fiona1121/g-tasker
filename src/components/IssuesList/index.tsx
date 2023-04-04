import { makeStyles } from "tss-react/mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import CircleIcon from "@mui/icons-material/Circle";

import _ from "lodash";
import IssueItem from "./IssueItem";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

interface Props {
	issues: any[];
	reload: () => void;
}

const useStyles = makeStyles()((theme) => ({
	root: {
		paddingTop: "40px",
		paddingBottom: "80px",
		backgroundColor: "#fff",
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

export default function IssueList({ issues, reload }: Props) {
	const { classes } = useStyles();
	const { state, dispatch } = useContext(AuthContext);
	const { repos, access_token } = state;

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newRepo, setNewRepo] = useState({ value: "", error: false, helperText: "" });
	const [newTitle, setNewTitle] = useState({ value: "", error: false, helperText: "" });
	const [newBody, setNewBody] = useState({ value: "", error: false, helperText: "" });

	const [editIssue, setEditIssue] = useState<any>(null);
	const owner = editIssue?.repository_url.split("/")[editIssue?.repository_url.split("/").length - 2];
	const repo = editIssue?.repository_url.split("/")[editIssue?.repository_url.split("/").length - 1];

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editTitle, setEditTitle] = useState("");
	const [editBody, setEditBody] = useState("");
	const [editStatus, setEditStatus] = useState("");

	const cancelCreate = () => {
		setCreateDialogOpen(false);
		setNewRepo({ value: "", error: false, helperText: "" });
		setNewTitle({ value: "", error: false, helperText: "" });
		setNewBody({ value: "", error: false, helperText: "" });
	};

	const createIssue = async () => {
		setNewRepo({ ...newRepo, error: false, helperText: "" });
		setNewTitle({ ...newTitle, error: false, helperText: "" });

		if (newRepo.value === "" || newTitle.value === "") {
			if (newRepo.value === "") {
				setNewRepo({ ...newRepo, error: true, helperText: "Repository is required" });
			}
			if (newTitle.value === "") {
				setNewTitle({ ...newTitle, error: true, helperText: "Title is required" });
			}
			return;
		}

		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await fetch(`https://api.github.com/repos/${newRepo.value}/issues`, {
			method: "POST",
			headers: {
				Authorization: `token ${access_token}`,
			},
			body: JSON.stringify({
				title: newTitle.value,
				body: newBody.value,
				labels: ["Open"],
			}),
		})
			.then((res) => {
				if (res.status === 201) {
					toast.success("Successfully created issue");
					setCreateDialogOpen(false);
					reload();
				} else if (res.status === 404) {
					toast.error("Repository not found");
					setNewRepo({
						...newRepo,
						error: true,
						helperText: "Repository not found",
					});
				} else {
					toast.error("Failed to create issue");
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Failed to create issue");
			});
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	};

	const cancelEdit = () => {
		setEditDialogOpen(false);
		setEditIssue(null);
		setEditTitle("");
		setEditBody("");
		setEditStatus("");
	};

	const saveEdit = async () => {
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await fetch(editIssue.url, {
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

	useEffect(() => {
		if (editIssue) {
			const title = editIssue?.title;
			const body = editIssue?.body;
			const status =
				_.filter(
					editIssue?.labels,
					(label) => label.name === "Open" || label.name === "Done" || label.name === "In Progress"
				)[0]?.name ?? "";
			setEditTitle(title);
			setEditBody(body);
			setEditStatus(status);
			setEditDialogOpen(true);
		}
	}, [editIssue]);

	return (
		<div className={classes.root}>
			<Container maxWidth="md">
				<Box style={{ textAlign: "center", marginBottom: "40px" }}>
					<Button startIcon={<AddIcon />} variant="outlined" onClick={() => setCreateDialogOpen(true)}>
						<Typography variant="body2" component="p">
							Create New Task
						</Typography>
					</Button>
				</Box>
				{_.map(issues, (issue) => {
					return <IssueItem issue={issue} reload={reload} setEditIssue={setEditIssue} />;
				})}
			</Container>
			<Dialog open={createDialogOpen} onClose={cancelCreate} fullWidth maxWidth="md">
				<DialogContent className={classes.dialogContent}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
								Repository
							</Typography>
							<TextField
								margin="dense"
								id="repo"
								type="text"
								size="small"
								fullWidth
								value={newRepo.value}
								error={newRepo.error}
								helperText={newRepo.helperText}
								onChange={(e) =>
									setNewRepo({
										...newRepo,
										value: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={12} md={8}>
							<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
								Title
							</Typography>
							<TextField
								margin="dense"
								id="title"
								type="text"
								size="small"
								fullWidth
								value={newTitle.value}
								error={newTitle.error}
								helperText={newTitle.helperText}
								onChange={(e) =>
									setNewTitle({
										...newTitle,
										value: e.target.value,
									})
								}
							/>
						</Grid>
					</Grid>
					<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
						Body <span style={{ color: "#aaa" }}>(optional)</span>
					</Typography>
					<TextField
						margin="dense"
						id="body"
						type="text"
						fullWidth
						multiline
						rows={10}
						value={newBody.value}
						onChange={(e) =>
							setNewBody({
								...newBody,
								value: e.target.value,
							})
						}
					/>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={cancelCreate}>Cancel</Button>
					<Button onClick={createIssue}>Create</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={editDialogOpen} onClose={cancelEdit} fullWidth maxWidth="md">
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
							startAdornment: <InputAdornment position="start">#{editIssue?.number}</InputAdornment>,
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
		</div>
	);
}
