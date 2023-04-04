import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import GithubAPI from "../api/GithubAPI";
import { AuthContext } from "../App";
import Header from "../components/Header";
import IssueList from "../components/IssuesList";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
	const { state, dispatch } = useContext(AuthContext);
	const { access_token, user, loading } = state;

	const [page, setPage] = useState(1);

	async function getUserInfo() {
		await GithubAPI.getUserInfo(access_token)
			.then((res) => {
				if (res.error) {
					throw new Error(`${res.error}: ${res.error_description}`);
				}
				if (res.login) {
					console.log(res);
					dispatch({ type: "LOGIN", payload: res });
				} else {
					throw new Error("Invalid response from Github API - No user info");
				}
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: "LOGOUT" });
				toast.error("Invalid access token. Please login again! ");
			});
	}

	async function getUserIssues() {
		await GithubAPI.getUserIssues(access_token, {
			per_page: 10,
			page: page,
			filter: "all",
			state: "open",
		})
			.then((res) => {
				console.log(res);
				if (res.error) {
					throw new Error(`${res.error}: ${res.error_description}`);
				}
				dispatch({ type: "SETSTATE", payload: { issues: res } });
			})
			.catch((err) => {
				console.error(err);
				dispatch({ type: "LOGOUT" });
				toast.error("Invalid access token. Please login again! ");
			});
	}

	async function fetchData() {
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		await getUserInfo();
		await getUserIssues();
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	}

	useEffect(() => {
		fetchData();
	}, []);

	if (!access_token) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<Header />
			<IssueList issues={state.issues} reload={fetchData} />
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
