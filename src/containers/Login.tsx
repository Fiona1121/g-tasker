import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

import Alert, { AlertColor } from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import GithubAPI from "../api/GithubAPI";
import { ResponseType } from "axios";
import { toast } from "react-toastify";

export default function Login() {
	const { state, dispatch } = useContext(AuthContext);
	const { client_id, redirect_uri } = state;

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
				await GithubAPI.getAccessToken(code)
					.then((res) => {
						if (res.error) {
							throw new Error(`${res.error}: ${res.error_description}`);
						}
						if (res.access_token) {
							localStorage.setItem("access_token", res.access_token);
							dispatch({ type: "SETSTATE", payload: { access_token: res.access_token } });
							setLoading(false);
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
		<Container maxWidth="sm">
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
			<div>
				<h1>Welcome</h1>
				<span>Super amazing app</span>
				<div className="login-container">
					{loading ? (
						<div className="loader-container">
							<div className="loader"></div>
						</div>
					) : (
						<>
							<a
								className="login-link"
								href={`https://github.com/login/oauth/authorize?scope=repo;user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
							>
								<GitHubIcon />
								<span>Login with GitHub</span>
							</a>
						</>
					)}
				</div>
			</div>
		</Container>
	);
}
