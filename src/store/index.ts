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
	access_token: string | null;
	user: any;
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	proxy_url: string;
}

export const initialState = {
	access_token: localStorage.getItem("access_token"),
	user: null,
	client_id: import.meta.env.VITE_CLIENT_ID,
	redirect_uri: import.meta.env.VITE_REDIRECT_URI,
	client_secret: import.meta.env.VITE_CLIENT_SECRET,
	proxy_url: import.meta.env.VITE_PROXY_URL,
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
			return {
				...state,
				access_token: null,
				user: null,
			};
		}
		default:
			return state;
	}
};
