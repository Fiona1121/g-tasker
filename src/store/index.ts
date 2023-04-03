enum AuthActionType {
	LOGIN = "LOGIN",
	LOGOUT = "LOGOUT",
}

interface AuthAction {
	type: AuthActionType;
	payload: any;
}

export interface AuthState {
	isLoggedIn: boolean;
	user: any;
	client_id: string;
	client_secret: string;
	redirect_uri: string;
	proxy_url: string;
}

export const initialState = {
	isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
	user: JSON.parse(localStorage.getItem("user") || "null"),
	client_id: import.meta.env.VITE_CLIENT_ID,
	redirect_uri: import.meta.env.VITE_REDIRECT_URI,
	client_secret: import.meta.env.VITE_CLIENT_SECRET,
	proxy_url: import.meta.env.VITE_PROXY_URL,
};

export const reducer = (state: AuthState, action: AuthAction) => {
	switch (action.type) {
		case AuthActionType.LOGIN: {
			localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn));
			localStorage.setItem("user", JSON.stringify(action.payload.user));
			return {
				...state,
				isLoggedIn: action.payload.isLoggedIn,
				user: action.payload.user,
			};
		}
		case AuthActionType.LOGOUT: {
			localStorage.clear();
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		}
		default:
			return state;
	}
};
