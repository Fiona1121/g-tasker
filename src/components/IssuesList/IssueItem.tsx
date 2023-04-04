import { useState } from "react";
import moment from "moment";
import _ from "lodash";

import { makeStyles } from "tss-react/mui";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
	issue: any;
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
		fontSize: "28px",
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

export default function IssueItem({ issue }: Props) {
	const { classes } = useStyles();

	const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const getLabelChip = (label: any) => {
		switch (label.name) {
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

	return (
		<>
			<Card variant="outlined" className={classes.issueWrapper}>
				<CardHeader
					avatar={<Avatar src={issue.user?.avatar_url}></Avatar>}
					action={
						<Box>
							{_.map(issue.labels, (label) => {
								return getLabelChip(label);
							})}
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
					<Typography variant="h4" component="h4" className={classes.issueTitle}>
						{issue.title}
					</Typography>
					<Typography
						variant="body1"
						component="p"
						className={classes.issueSummary}
						dangerouslySetInnerHTML={{ __html: issue.body }}
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
					<MenuItem onClick={() => setMenuAnchorEl(null)}>
						<ListItemIcon>
							<DeleteIcon fontSize="small" />
						</ListItemIcon>
						<ListItemText primary="Delete" />
					</MenuItem>
				</Menu>
			</Card>
			<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
				Edit Issue
			</Dialog>
		</>
	);
}
