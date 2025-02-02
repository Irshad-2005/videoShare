import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";

const toggleVideoLike = asyncHandlers(async (req, res) => {
	const { videoId } = req.params;
	//FIXME: toggle like on video
	// find the video are present or not
	// check user are already like in video then remove like
	//create a like model
	//return res

	if (!isValidObjectId(videoId)) {
		return res.status(400).json(new ApiError(200, "videoId are not valid"));
	}

	const VideoLike = await Like.findOne({
		video: videoId,
		likeBy: req.user._id,
	});
	if (VideoLike) {
		const deleteLike = await Like.findByIdAndDelete(VideoLike._id);
		return res
			.status(200)
			.json(new ApiResponse(200, deleteLike, "remove like in video"));
	}
	const newLike = await Like.create({
		video: videoId,
		likeBy: req.user._id,
	});
	return res.status(201).json(new ApiResponse(201, newLike, "like to video "));
});

const toggleCommentLike = asyncHandlers(async (req, res) => {
	const { commentId } = req.params;
	//FIXME: toggle like on comment

	// if check commentId is valid or not
	// if check are comment like or not like
	// if check comment like then remove like
	// if are not like then like and return res

	if (!isValidObjectId(commentId)) {
		return res.status(400).json(new ApiError(400, "commentId are not valid"));
	}
	const commentLikePresent = await Like.findOne({
		comment: commentId,
		likeBy: req.user._id,
	});
	if (commentLikePresent) {
		const removeCommentLike = await Like.findByIdAndDelete(
			commentLikePresent._id,
		);

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					removeCommentLike,
					"Comment like are remove successfull",
				),
			);
	}

	const commentLike = await Like.create({
		comment: commentId,
		likeBy: req.user._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, commentLike, "comment like are successfully"));
});

const toggleTweetLike = asyncHandlers(async (req, res) => {
	const { tweetId } = req.params;
	//FIXME: toggle like on tweet
	// if check tweetId are valid or not
	// if check tweet are already like or not and tweet like already then remove like
	// if check tweet are not like then like to tweet
	// return res

	if (!isValidObjectId(tweetId)) {
		return res.status(400).json(new ApiError(400, "tweetId are not valid"));
	}

	const tweetLikePresent = await Like.findOne({
		tweet: tweetId,
		likeBy: req.user._id,
	});
	if (tweetLikePresent) {
		const removeTweetLike = await Like.findByIdAndDelete(tweetLikePresent._id);
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					removeTweetLike,
					"tweet like are remove sucessfully",
				),
			);
	}

	const tweetLike = await Like.create({
		tweet: tweetId,
		likeBy: req.user._id,
	});

	res
		.status(201)
		.json(new ApiResponse(201, tweetLike, "tweet are likes successfully"));
});

const getLikedVideos = asyncHandlers(async (req, res) => {
	//TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
