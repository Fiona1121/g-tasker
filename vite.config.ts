import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		proxy: {
			"/github/oauth": {
				target: "https://github.com/login/oauth",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/github\/oauth/, ""),
			},
			"/github": {
				target: "https://api.github.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/github/, ""),
			},
		},
	},
	plugins: [react()],
});
