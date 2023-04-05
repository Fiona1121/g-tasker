import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

import Alert, { AlertColor } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import GitHubIcon from "@mui/icons-material/GitHub";
import GithubAPI from "../api/GithubAPI";
import { toast } from "react-toastify";
import { DialogContent, DialogTitle } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
	root: {
		height: "100vh",
		width: "100vw",
		backgroundColor: "#f5f5f5",
	},
	container: {
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		width: "100%",
		padding: theme.spacing(8),
		textAlign: "center",
	},
	loginLink: {
		width: "fit-content",
		maxWidth: "250px",
		margin: "0 auto",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		textDecoration: "none",
		color: "#000",
		padding: theme.spacing(1, 2),
		borderRadius: "5px",
		border: "1px solid #000",
		"&:hover": {
			backgroundColor: "#000",
			color: "#fff",
		},
	},
}));

export default function Login() {
	const { classes } = useStyles();
	const { state, dispatch } = useContext(AuthContext);
	const { client_id, client_secret, redirect_uri } = state;

	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState<{ open: boolean; message: string; type: AlertColor }>({
		open: false,
		message: "",
		type: "success",
	});

	useEffect(() => {
		// After requesting Github access, Github redirects back to your app with a code parameter
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const code = urlParams.get("code");

		// If Github API returns the code parameter
		if (code) {
			async function getAccessToken() {
				setLoading(true);
				await GithubAPI.getAccessToken(client_id, client_secret, code)
					.then((res) => {
						if (res.status === 200) {
							res.json().then((data) => {
								if (data.access_token) {
									localStorage.setItem("access_token", data.access_token);
									dispatch({ type: "SETSTATE", payload: { access_token: data.access_token } });
									setLoading(false);
									toast.success("Login successful! ");
								} else {
									throw new Error("Invalid response from Github API - No access token");
								}
							});
						} else {
							throw new Error("Invalid response from Github API - No access token");
						}
					})
					.catch((err) => {
						console.error(err);
						setLoading(false);
						toast.error("Login failed. Please try again! ");
					});
			}
			getAccessToken();
		}
	}, []);

	if (state.access_token) {
		return <Navigate to="/" />;
	}

	return (
		<div className={classes.root}>
			<Container maxWidth="xs" className={classes.container}>
				<Snackbar
					open={alert.open}
					autoHideDuration={6000}
					anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
					TransitionComponent={(props) => <Slide {...props} direction="left" />}
					onClose={() => setAlert({ ...alert, open: false })}
				>
					<Alert severity={alert.type} sx={{ width: "100%" }} elevation={6} variant="filled">
						{alert.message}
					</Alert>
				</Snackbar>
				<Card className={classes.card}>
					<div style={{ marginBottom: "20px", color: "#555" }}>
						<Typography variant="h4" component="h4" sx={{ fontWeight: 600 }}>
							G-Tasker
						</Typography>
					</div>
					<a
						className={classes.loginLink}
						href={`https://github.com/login/oauth/authorize?scope=repo;user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
					>
						<GitHubIcon />
						<Typography variant="body1" component="p" sx={{ fontWeight: 500, marginLeft: "10px" }}>
							Login with Github
						</Typography>
					</a>
				</Card>
				<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</Container>
		</div>
	);
}
