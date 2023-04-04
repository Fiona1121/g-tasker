import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import GithubAPI from "../api/GithubAPI";
import { AuthContext } from "../App";
import Header from "../components/Header";
import IssueList from "../components/IssuesList";

export default function Home() {
	const { state, dispatch } = useContext(AuthContext);
	const { access_token, user } = state;

	const [loading, setLoading] = useState(false);
	const [issues, setIssues] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		async function getUserInfo() {
			await GithubAPI.getUserInfo(access_token)
				.then((res) => {
					if (res.error) {
						throw new Error(`${res.error}: ${res.error_description}`);
					}
					if (res.login) {
						console.log(res);
						dispatch({ type: "LOGIN", payload: res });
						toast.success("Welcome!");
						setLoading(false);
					} else {
						throw new Error("Invalid response from Github API - No user info");
					}
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
					dispatch({ type: "LOGOUT" });
					toast.error("Invalid access token. Please login again! ");
				});
		}
		getUserInfo();
	}, []);

	useEffect(() => {
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
					setIssues(res);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setLoading(false);
					dispatch({ type: "LOGOUT" });
					toast.error("Invalid access token. Please login again! ");
				});
		}
		getUserIssues();
	}, []);

	if (!access_token) {
		return <Navigate to="/login" />;
	}

	return (
		<>
			<Header />
			<IssueList issues={issues} />
		</>
	);
}
