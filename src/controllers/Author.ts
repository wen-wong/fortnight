import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/Author";

async function createAuthor(req: Request, res: Response, _next: NextFunction) {
	const session = await mongoose.startSession();
	try {
		const { name } = await req.body;

		session.startTransaction();
		const author = new Author({
			_id: new mongoose.Types.ObjectId(),
			name
		});
		await author.save({ session: session });
		res.status(201).json({ author });
		await session.commitTransaction();
	} catch (error) {
		res.status(500).json({ error });
		await session.abortTransaction();
	}
	session.endSession();
	return res;
}

async function readAuthor(req: Request, res: Response, _next: NextFunction) {
	try {
		const authorId = req.params.authorId;
		const author = await Author.findById(authorId);
		return author
			? res.status(200).json({ author })
			: res.status(404).json({ message: "Not found" });
	} catch (error) {
		return res.status(500).json({ error });
	}
}

async function readAllAuthor(_req: Request, res: Response, _next: NextFunction) {
	try {
		const authors = await Author.find();
		return res.status(200).json({ authors });
	} catch (error) {
		return res.status(500).json({ error });
	}
}

async function updateAuthor(req: Request, res: Response, _next: NextFunction) {
	const session = await mongoose.startSession();
	try {
		const authorId = req.params.authorId;

		session.startTransaction();
		const author = await Author.findById(authorId).session(session);
		if (author) {
			author.set(req.body);
			await author.save();
			res.status(201).json({ author });
		} else {
			res.status(404).json({ message: "Not found" });
		}
		await session.commitTransaction();
	} catch (error) {
		res.status(500).json({ error });
		await session.abortTransaction();
	}

	session.endSession();
	return res;
}

const deleteAuthor = async (req: Request, res: Response, _next: NextFunction) => {
	const session = await mongoose.startSession();
	try {
		const authorId = req.params.authorId;

		session.startTransaction();
		const author = await Author.findByIdAndDelete(authorId).session(session);
		author
			? res.status(201).json({ message: "Deleted" })
			: res.status(404).json({ message: "Not found" });
		await session.commitTransaction();
	} catch (error) {
		res.status(500).json({ error });
		await session.abortTransaction();
	}

	session.endSession();
	return res;
};

export default {
	createAuthor,
	readAuthor,
	readAllAuthor,
	updateAuthor,
	deleteAuthor
};
