import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import GithubAPI from "../api/GithubAPI";
import { ResponseType } from "axios";

export default function Login() {
	const { state, dispatch } = useContext(AuthContext);
	const { client_id, redirect_uri } = state;

	const [data, setData] = useState({ errorMessage: "", isLoading: false });

	useEffect(() => {
		// After requesting Github access, Github redirects back to your app with a code parameter
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const code = urlParams.get("code");

		// If Github API returns the code parameter
		if (
			code &&
			(localStorage.getItem("access_token") === null || localStorage.getItem("access_token") === undefined)
		) {
			async function getAccessToken() {
				setData({ ...data, isLoading: true });
				await GithubAPI.getAccessToken(code)
					.then((res) => {
						if (res.access_token) {
							console.log(res);
							localStorage.setItem("access_token", res.access_token);
							localStorage.setItem("scope", res.scope);
							localStorage.setItem("token_type", res.token_type);
							setData({ ...data, isLoading: false });
							dispatch({ type: "LOGIN" });
						} else {
							setData({
								...data,
								errorMessage: "Something went wrong. Please login again!",
								isLoading: false,
							});
						}
					})
					.catch((err) => {
						console.log(err);
						setData({ ...data, errorMessage: "Something went wrong", isLoading: false });
					});
			}
			getAccessToken();
		}
	}, []);

	if (state.isLoggedIn) {
		return <Navigate to="/" />;
	}
	return (
		<Container maxWidth="sm">
			<div>
				<h1>Welcome</h1>
				<span>Super amazing app</span>
				<span>{data.errorMessage}</span>
				<div className="login-container">
					{data.isLoading ? (
						<div className="loader-container">
							<div className="loader"></div>
						</div>
					) : (
						<>
							<a
								className="login-link"
								href={`https://github.com/login/oauth/authorize?scope=repo;user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
								onClick={() => {
									setData({ ...data, errorMessage: "" });
								}}
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
