import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);

// Remove React Strict Mode
// (Will render twice in dev mode)
// FIRST RENDER: we use the one time code to get access token from Github API
// SECOND RENDER: use the one time code again, which will return an error
