import React, { createContext, useReducer } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import Theme from "./theme/theme";

import { AuthState, initialState, reducer } from "./store";
export const AuthContext = createContext<{ state: AuthState; dispatch: React.Dispatch<any> }>({
	state: initialState,
	dispatch: () => null,
});

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<AuthContext.Provider
				value={{
					state,
					dispatch,
				}}
			>
				<RouterProvider router={router} />
			</AuthContext.Provider>
		</ThemeProvider>
	);
}

export default App;
