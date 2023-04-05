const GithubAPI = {
	getAccessToken: async (client_id: string, client_secret: string, code: string | null) => {
		return await fetch(
			`/github/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
				},
			}
		);
	},
	getUserInfo: async (token: string | null) => {
		return await fetch(`/github/user`, {
			method: "GET",
			headers: {
				Authorization: `token ${token}`,
			},
		});
	},
	getIssues: async (token: string | null, params: any) => {
		return await fetch(`/github/search/issues?` + new URLSearchParams(params), {
			method: "GET",
			headers: {
				Authorization: `token ${token}`,
			},
		});
	},
	patchIssue: async (token: string | null, url: string, bodyData: any) => {
		return await fetch(url, {
			method: "PATCH",
			headers: {
				Authorization: `token ${token}`,
			},
			body: JSON.stringify(bodyData),
		});
	},
	postIssue: async (token: string | null, repo: string, bodyData: any) => {
		return fetch(`/github/repos/${repo}/issues`, {
			method: "POST",
			headers: {
				Authorization: `token ${token}`,
			},
			body: JSON.stringify(bodyData),
		});
	},
};

export default GithubAPI;
