import mongoose from "mongoose";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";

const getVideoComments = asyncHandlers(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;
	const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandlers(async (req, res) => {
	// FIXME: add a comment to a video
	const { content } = req.body;
	const { videoId } = req.params;

	if (!content) {
		throw new ApiError(400, "Please enter comment");
	}

	const comment = await Comment.create({
		content,
		video: videoId,
		onwer: req.user._id,
	});

	res
		.status(201)
		.json(new ApiResponse(201, comment, "comment are successfully create"));
});

const updateComment = asyncHandlers(async (req, res) => {
	// FIXME: update a comment
	//find the comment and validate
	//update comment
	//return res
	const { commentId } = req.params;
	const { content } = req.body;

	if (!content) {
		throw new ApiError(400, "Please comment are required");
	}

	const comment = await Comment.findByIdAndUpdate(
		commentId,
		{ content },
		{ new: true },
	);

	res
		.status(200)
		.json(new ApiResponse(200, comment, "comment are update successfully"));
});

const deleteComment = asyncHandlers(async (req, res) => {
	// FIXME: delete a comment

	//find the commentId
	// delete comment content
	//return res

	const { commentId } = req.params;

	const comment = await Comment.findByIdAndDelete(commentId);

	res
		.status(200)
		.json(new ApiResponse(200, comment, "comment are delete successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
