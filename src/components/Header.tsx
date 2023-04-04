import { makeStyles } from "tss-react/mui";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";
import SearchIcon from "@mui/icons-material/Search";

import { useContext, useState } from "react";
import { AuthContext } from "../App";

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
	headerToolBox: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: "5px",
		marginBottom: "10px",
		marginRight: "7%",
		marginLeft: "7%",
	},
	headerSearch: {
		width: "100%",
		maxWidth: "600px",
	},
	dialogActions: {
		padding: theme.spacing(2),
	},
}));

export default function Header() {
	const { classes } = useStyles();
	const { state, dispatch } = useContext(AuthContext);

	const [searchContent, setSearchContent] = useState("");
	const [filters, setFilters] = useState(state.filters);
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);

	const applyFilters = () => {
		if (filters.status.length === 0) {
			setFilters({ ...filters, status: ["Open", `"In Progress"`, "Done"] });
			dispatch({
				type: "SETSTATE",
				payload: {
					filters: {
						...filters,
						status: ["Open", `"In Progress"`, "Done"],
					},
				},
			});
		} else {
			dispatch({ type: "SETSTATE", payload: { filters: filters } });
		}
		setFilterDialogOpen(false);
	};

	const resetFilters = () => {
		setFilters({
			...filters,
			status: ["Open", `"In Progress"`, "Done"],
			sort: "created",
		});
	};

	const cancelFilters = () => {
		setFilters(state.filters);
		setFilterDialogOpen(false);
	};

	const handleSearch = () => {
		dispatch({
			type: "SETSTATE",
			payload: {
				filters: {
					...filters,
					searchContent,
				},
			},
		});
	};

	return (
		<div className={classes.headerSection}>
			<Container maxWidth="md">
				<div className={classes.headerTitle}>
					<Typography variant="h3" component="h3" sx={{ fontWeight: 600 }}>
						G-Tasker
					</Typography>
				</div>
				<div className={classes.headerToolBox}>
					<IconButton onClick={() => setFilterDialogOpen(true)}>
						<FilterAltIcon />
					</IconButton>
					<div className={classes.headerSearch}>
						<TextField
							label="Search"
							placeholder="Search for tasks..."
							variant="outlined"
							fullWidth
							value={searchContent}
							onChange={(e) => setSearchContent(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={handleSearch}>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</div>
				</div>
			</Container>
			<Dialog open={filterDialogOpen} onClose={cancelFilters} maxWidth="sm" fullWidth>
				<DialogTitle>
					Filter
					<IconButton
						aria-label="close"
						onClick={cancelFilters}
						sx={{
							position: "absolute",
							right: (theme) => theme.spacing(2),
							top: (theme) => theme.spacing(2),
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
								Status
							</Typography>
							<Select
								value={filters.status}
								style={{ marginTop: "8px", minWidth: "250px" }}
								size="small"
								multiple
								fullWidth
								onChange={(e) => setFilters({ ...filters, status: e.target.value })}
								renderValue={(selected) => (
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
										{selected.map((value: string) => (
											<Chip key={value} label={value} />
										))}
									</Box>
								)}
							>
								<MenuItem value="Open">
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CircleIcon
											color="success"
											style={{ marginRight: "10px" }}
											sx={{ fontSize: 10 }}
										/>
										<Typography variant="body1" component="span">
											Open
										</Typography>
									</Box>
								</MenuItem>
								<MenuItem value={`"In Progress"`}>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CircleIcon
											color="warning"
											style={{ marginRight: "10px" }}
											sx={{ fontSize: 10 }}
										/>
										<Typography variant="body1" component="span">
											In Progress
										</Typography>
									</Box>
								</MenuItem>
								<MenuItem value="Done">
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CircleIcon
											color="info"
											style={{ marginRight: "10px" }}
											sx={{ fontSize: 10 }}
										/>
										<Typography variant="body1" component="span">
											Done
										</Typography>
									</Box>
								</MenuItem>
							</Select>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" component="p" style={{ marginTop: "10px" }}>
								Sort By
							</Typography>
							<ToggleButtonGroup
								exclusive
								color="info"
								size="small"
								value={filters.sort}
								style={{ marginTop: "8px" }}
								onChange={(e, newSort) => setFilters({ ...filters, sort: newSort })}
							>
								<ToggleButton value="created" style={{ textTransform: "none" }}>
									Created Date
								</ToggleButton>
								<ToggleButton value="updated" style={{ textTransform: "none" }}>
									Updated Date
								</ToggleButton>
							</ToggleButtonGroup>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={resetFilters} color="error">
						Reset
					</Button>
					<Button onClick={applyFilters}>Apply</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
