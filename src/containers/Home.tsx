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
	const [hasMore, setHasMore] = useState(true);

	async function getUserInfo() {
		return await GithubAPI.getUserInfo(access_token)
			.then((res) => {
				if (res.error) {
					throw new Error(`${res.error}: ${res.error_description}`);
				}
				if (res.login) {
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

	async function fetchIssues() {
		return await fetch(
			`https://api.github.com/search/issues?` +
				new URLSearchParams({
					q: `label:${state.filters.status.join(",")} user:${state.user.login} in:title,body state:open ${
						state.filters.searchContent
					}`,
					sort: state.filters.sort,
					order: "desc",
					per_page: "10",
					page: page.toString(),
				}),

			{
				method: "GET",
				headers: {
					Authorization: `token ${state.access_token}`,
				},
			}
		).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					const newIssues = page === 1 ? data.items : [...state.issues, ...data.items];
					setHasMore(data.total_count > newIssues.length);
					dispatch({
						type: "SETSTATE",
						payload: { issues: newIssues },
					});
				});
			} else {
				toast.error("Error fetching issues. Please try again later!");
			}
		});
	}

	async function init() {
		dispatch({ type: "SETSTATE", payload: { loading: true } });
		setPage(1);
		await getUserInfo();
		await fetchIssues();
		dispatch({ type: "SETSTATE", payload: { loading: false } });
	}

	useEffect(() => {
		init();
	}, []);

	useEffect(() => {
		async function handleScroll() {
			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			const clientHeight = document.documentElement.clientHeight || window.innerHeight;
			if (scrollTop + clientHeight >= scrollHeight && hasMore) {
				// send API request to load more tasks
				dispatch({ type: "SETSTATE", payload: { loading: true } });
				setPage(page + 1);
				await fetchIssues();
				dispatch({ type: "SETSTATE", payload: { loading: false } });
			}
		}

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasMore, fetchIssues]);

	useEffect(() => {
		async function handleFilter() {
			dispatch({ type: "SETSTATE", payload: { loading: true } });
			setPage(1);
			await fetchIssues();
			dispatch({ type: "SETSTATE", payload: { loading: false } });
		}
		handleFilter();
	}, [state.filters]);

	if (!access_token) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<Header />
			<IssueList issues={state.issues} init={init} />
			<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}
