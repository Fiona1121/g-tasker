import { useContext } from "react";
import { AuthContext } from "../App";
import Header from "../components/Header";
import IssueList from "../components/IssueList";

export default function Home() {
	const { state, dispatch } = useContext(AuthContext);
	const { isLoggedIn } = state;
	const { avatar_url, name, public_repos, followers, following } = state.user;

	if (!isLoggedIn) {
		window.location.href = "/login";
	}
	return (
		<>
			<Header />
			<IssueList />
		</>
	);
}
