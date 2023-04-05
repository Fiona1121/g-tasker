enum AuthActionType {
	SETSTATE = "SETSTATE",
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
}

interface AuthAction {
	type: AuthActionType;
	payload: any;
}

export interface AuthState {
	loading: boolean;
	access_token: string | null;
	user: any;
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	repos: any[];
	issues: any[];
	filters: any;
}

export const initialState = {
	loading: false,
	access_token: localStorage.getItem("access_token"),
	user: null,
	client_id: import.meta.env.VITE_CLIENT_ID,
	client_secret: import.meta.env.VITE_CLIENT_SECRET,
	redirect_uri: import.meta.env.VITE_REDIRECT_URI,
	repos: [],
	issues: [],
	filters: {
		searchContent: "",
		status: ["Open", `"In Progress"`, "Done"],
		sort: "created",
	},
};

export const reducer = (state: AuthState, action: AuthAction) => {
	switch (action.type) {
		case AuthActionType.SETSTATE: {
			return {
				...state,
				...action.payload,
			};
		}
		case AuthActionType.LOGIN: {
			return {
				...state,
				user: action.payload,
			};
		}
		case AuthActionType.LOGOUT: {
			localStorage.clear();
			return initialState;
		}
		default:
			return state;
	}
};
