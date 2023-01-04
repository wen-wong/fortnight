import mongoose, { Document, Schema } from "mongoose";

export interface IPost {
	title: string;
	author: string;
}

export interface IPostModel extends IPost, Document {}

const PostSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, required: true, ref: "Author" }
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IPostModel>("Post", PostSchema);
