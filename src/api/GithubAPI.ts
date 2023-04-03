import axios from "axios";

interface GetAccessTokenReqData {
	client_id: string;
	client_secret: string;
	code: string;
	redirect_uri: string;
}

const GithubAPI = {
	getAccessToken: async (code: string | null) => {
		try {
			const data = await fetch(`/api/github/getAccessToken?code=${code}`, {
				method: "GET",
			}).then((res) => res.json());
			return data;
		} catch (error) {
			console.log(error);
		}
	},
	getUserData: async (token: string) => {
		try {
			const { data, status } = await axios.get("https://api.github.com/user", {
				headers: {
					Authorization: `token ${token}`,
				},
			});
			console.log(data, status);
			if (status === 200) {
				return data;
			}
		} catch (error) {
			console.log(error);
		}
	},
};

export default GithubAPI;
