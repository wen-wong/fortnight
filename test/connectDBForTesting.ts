import mongoose from "mongoose";
import { config } from "../src/config/config";
import Logging from "../src/library/Logging";

export async function connectDBForTesting() {
	try {
		const DB_NAME = "test";
		mongoose.set("strictQuery", false);
		await mongoose.connect(config.mongo.url, {
			dbName: DB_NAME,
			autoCreate: true
		});
	} catch (error) {
		Logging.error("Database connection error.");
	}
}

export async function disconnectDBForTesting() {
	try {
		await mongoose.connection.close();
	} catch (error) {
		Logging.error("Database disconnection error.");
	}
}
