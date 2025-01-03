import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandlers(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
});

const publishVideo = asyncHandlers(async (req, res) => {
    const { title, description } = req.body;

    // TODO: get video, upload to cloudinary, create video
    if (!title && !description) {
        return res
            .status(400)
            .json(new ApiError(404, "title and description are missing.."));
    }
    const videoLocalPath = req.files.videoFile[0].path;
    if (!videoLocalPath) {
        return res.status(400).json(new ApiError(404, "video are required"));
    }
    const thumbnailLocalPath = req.files.thumbnail[0].path;
    if (!thumbnailLocalPath) {
        return res
            .status(400)
            .json(new ApiError(400, "thumbnail are required"));
    }
    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const video = await Video.create({
        videoFile: uploadVideo.url,
        thumbnail: uploadThumbnail.url,
        title,
        description,
        duration: uploadVideo.duration,
        owner: req.user._id,
        isPublished: true,
    });
    res.status(200).json(
        new ApiResponse(200, video, "video upload are successfully")
    );
});

const getVideoById = asyncHandlers(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
});

const updateVideo = asyncHandlers(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandlers(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
});

const togglePublishStatus = asyncHandlers(async (req, res) => {
    const { videoId } = req.params;
});

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
