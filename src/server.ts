import express from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import authorRoutes from "./routes/Author";
import postRoutes from "./routes/Post";

const router = express();

/** Connect to Mongo */
mongoose.set("strictQuery", false);
mongoose
	.connect(config.mongo.url, { retryWrites: true, w: "majority" })
	.then(() => {
		Logging.info("Connected to MongoDB.");
		startServer();
	})
	.catch((error) => {
		Logging.error("Unable to connect: ");
		Logging.error(error);
	});

/** Only start the server if Mongo Connects */
const startServer = () => {
	router.use((req, res, next) => {
		/** Log the Request */
		Logging.info(
			`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
		);

		res.on("finish", () => {
			/** Log the Response */
			Logging.info(
				`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
			);
		});

		next();
	});

	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());

	/** Routes */
	router.use("/authors", authorRoutes);
	router.use("/posts", postRoutes);

	/** Healthcheck */
	router.get("/", (_req, res, _next) =>
		res.status(200).json({ message: "Healthcheck Achieved." })
	);

	router.get("/ping", (_req, res, _next) => res.status(200).json({ message: "pong" }));

	/** Error handling */
	router.use((_req, res, _next) => {
		const error = new Error("not found");
		Logging.error(error);

		return res.status(404).json({ message: error.message });
	});

	http.createServer(router).listen(config.server.port, () =>
		Logging.info(`Server is running on port ${config.server.port}.`)
	);
};
