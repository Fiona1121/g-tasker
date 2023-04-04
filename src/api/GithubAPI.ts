import axios from "axios";

interface GetAccessTokenReqData {
	client_id: string;
	client_secret: string;
	code: string;
	redirect_uri: string;
}

const GithubAPI = {
	getAccessToken: async (code: string | null) => {
		return fetch(`/api/github/getAccessToken?code=${code}`, {
			method: "GET",
		}).then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		});
	},
	getUserInfo: async (token: string | null) => {
		return await fetch(`/api/github/getUserInfo`, {
			method: "GET",
			headers: {
				Authorization: `token ${token}`,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		});
	},
	getUserIssues: async (token: string | null, config: any = {}) => {
		return await fetch(`/api/github/getUserIssues?` + new URLSearchParams(config), {
			method: "GET",
			headers: {
				Authorization: `token ${token}`,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(res.statusText);
			}
			return res.json();
		});
	},
};

export default GithubAPI;
