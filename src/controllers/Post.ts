import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";

const createPost = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const { title, author } = await req.body;

		const post = new Post({
			_id: new mongoose.Types.ObjectId(),
			title,
			author
		});

		await post.save();
		return res.status(201).json({ post });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readPost = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const postId = req.params.postId;
		const post = await Post.findById(postId, "title author");
		await post?.populate("author");
		return post
			? res.status(200).json({ post })
			: res.status(404).json({ message: "Not found" });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readAllPost = async (_req: Request, res: Response, _next: NextFunction) => {
	try {
		const posts = await Post.find({}, "title author");
		return res.status(200).json({ posts });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updatePost = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const postId = req.params.postId;
		const post = await Post.findById(postId);
		if (post) {
			post.set(req.body);
			await post.save();

			return res.status(201).json({ post });
		} else {
			return res.status(404).json({ message: "Not found" });
		}
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const deletePost = async (req: Request, res: Response, _next: NextFunction) => {
	try {
		const postId = req.params.postId;
		const post = await Post.findByIdAndDelete(postId);

		return post
			? res.status(201).json({ message: "Deleted" })
			: res.status(404).json({ message: "Not found" });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createPost,
	readPost,
	readAllPost,
	updatePost,
	deletePost
};
