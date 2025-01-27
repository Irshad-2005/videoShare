import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandlers(async (req, res) => {
      const {
            page = 1,
            limit = 10,
            query,
            sortBy,
            sortType,
            userId,
      } = req.query;
      //TODO: get all videos based on query, sort, pagination
});

const publishVideo = asyncHandlers(async (req, res) => {
      const { title, description } = req.body;

      // FIXME: get video, upload to cloudinary, create video
      if (!title && !description) {
            return res
                  .status(400)
                  .json(
                        new ApiError(404, "title and description are missing..")
                  );
      }
      const videoLocalPath = req.files.videoFile[0].path;
      if (!videoLocalPath) {
            return res
                  .status(400)
                  .json(new ApiError(404, "video are required"));
      }
      const thumbnailLocalPath = req.files.thumbnail[0].path;
      if (!thumbnailLocalPath) {
            return res
                  .status(400)
                  .json(new ApiError(400, "thumbnail are required"));
      }
      const uploadVideo = await uploadOnCloudinary(videoLocalPath);
      const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
      console.log(uploadThumbnail);
      const video = await Video.create({
            videoFile: uploadVideo?.url,
            thumbnail: uploadThumbnail?.url,
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
      //FIXME: get video by id
      if (!videoId) {
            res.status(404).json(new ApiError(404, "videoId are required"));
      }
      const video = await Video.findById(videoId);

      if (!video) {
            res.status(404).json(new ApiError(404, "video are not found"));
      }
      console.log(video);
      res.status(200).json(
            new ApiResponse(200, video, "Video fetched sucessfully")
      );
});

const updateVideo = asyncHandlers(async (req, res) => {
      const { videoId } = req.params;
      const { title, description } = req.body;
      //FIXME: update video details like title, description, thumbnail
      // find the videoId in req params and validate
      // find video to videoId
      // find all update details in req
      // update all details
      // return res

      if (!videoId) {
            res.json(404).json(new ApiError(404, "video id are not present"));
      }

      console.log(req.file.path);
      const thumbnailLocalPath = req.file.path;

      if (!thumbnailLocalPath) {
            res.status(400).json(400, "thumbnail are required");
      }

      const updateThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      const updateVideoDetails = await Video.findByIdAndUpdate(
            videoId,
            {
                  title: title,
                  description: description,
                  thumbnail: updateThumbnail.url,
            },
            { new: true }
      );

      res.status(200).json(
            new ApiResponse(
                  200,
                  updateVideoDetails,
                  "video updation successfully"
            )
      );
});

const deleteVideo = asyncHandlers(async (req, res) => {
      const { videoId } = req.params;
      //FIXME: delete video

      //find the video in videoID and validate
      //find VideoFile in video
      //delete video
      //return res

      if (!videoId) {
            return res
                  .status(400)
                  .json(new ApiError(400, "videoId are required"));
      }

      const deletedVideo = await Video.findByIdAndDelete(videoId);
      console.log("deleted : ", deletedVideo);

      if (!deletedVideo) {
            return res
                  .status(500)
                  .json(new ApiError(500, "Something went wrong "));
      }

      res.status(200).json(
            new ApiResponse(200, deletedVideo, "video are deleted sucessfully")
      );
});

const togglePublishStatus = asyncHandlers(async (req, res) => {
      const { videoId } = req.params;
      const { publishStatus } = req.body;
      // find videoId on req params
      // find video to videoId
      // find publishStaus in req body
      //update the publishStatus
      // return res

      if (!videoId) {
            res.status(400).json(new ApiError(400, "videoId are required"));
      }
      const updatePublishStatus = await Video.findByIdAndUpdate(
            videoId,
            {
                  isPublished: publishStatus,
            },
            { new: true }
      );
      res.status(200).json(
            new ApiResponse(
                  200,
                  updatePublishStatus,
                  "Update publishStatus successfully"
            )
      );
});

export {
      getAllVideos,
      publishVideo,
      getVideoById,
      updateVideo,
      deleteVideo,
      togglePublishStatus,
};
