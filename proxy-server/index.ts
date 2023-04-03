import cors from "cors";
import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
import Logger from "./lib/logger";
import morganMiddleware from "./config/morganMiddleware";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { VITE_CLIENT_ID: CLIENT_ID, VITE_CLIENT_SECRET: CLIENT_SECRET, REDIRECT_URI, PROXY_URL } = process.env;

const PORT = process.env.SERVER_PORT || 5174;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morganMiddleware);

/**
 * @description Get access token from github using one time code
 * @route GET /getAccessToken
 * @access Public
 * @param {string} code
 * @returns {object} access_token, scope, token_type
 */
app.get("/github/getAccessToken", async (req: Request, res: Response) => {
	const { code } = req.query;
	try {
		const data = await axios(
			`https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
				},
			}
		).then(({ data, status }) => {
			res.status(status).json(data);
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/github/getUserData", async (req: Request, res: Response) => {
	try {
		const data = await axios("https://api.github.com/user", {
			method: "GET",
			headers: {
				Authorization: req.get("Authorization") || "",
			},
		}).then(({ data, status }) => {
			res.status(status).json(data);
		});
	} catch (error) {
		Logger.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.listen(PORT, () => {
	Logger.info(`Server running at http://localhost:${PORT}`);
});
