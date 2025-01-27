import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playlists.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";

const createPlaylist = asyncHandlers(async (req, res) => {
      const { name, description } = req.body;
      //FIXME: create playlist
      //find videoId or name and description and validate
      //create a playlist
      //return res

      if (!name && !description) {
            return res
                  .status(400)
                  .json(
                        new ApiError(
                              new ApiError(
                                    400,
                                    "name or description are required"
                              )
                        )
                  );
      }

      const playList = await PlayList.create({
            name,
            description,
            onwer: req.user._id,
      });

      res.status(201).json(
            new ApiResponse(201, playList, "playList are create successfully")
      );
});

const getUserPlaylists = asyncHandlers(async (req, res) => {
      const { userId } = req.params;
      //FIXME: get user playlists

      //find userId and validate
      //find playlist in userId
      // return res

      if (!isValidObjectId(userId)) {
            return res
                  .status(404)
                  .json(new ApiError(404, "userId are not valid"));
      }
      const AllPlaylists = await PlayList.find({ onwer: userId });

      if (!AllPlaylists) {
            return res.status(400).json(400, "playList are not exists");
      }

      res.status(200).json(
            new ApiResponse(
                  200,
                  AllPlaylists,
                  "User are All Playlist fetch successfully"
            )
      );
});

const getPlaylistById = asyncHandlers(async (req, res) => {
      const { playlistId } = req.params;
      //FIXME: get playlist by id
      //find PlayListId and validate
      //find playList in playListId
      //return res

      if (!isValidObjectId(playlistId)) {
            return res
                  .status(400)
                  .json(new ApiError(400, "playlistId are not valid"));
      }

      const playList = await PlayList.findById(playlistId);

      if (!playList) {
            return res
                  .status(404)
                  .json(new ApiError(404, "playList are not found"));
      }

      res.status(200).json(
            new ApiResponse(
                  200,
                  playList,
                  "playList fetch are successfully in playlistId"
            )
      );
});

const addVideoToPlaylist = asyncHandlers(async (req, res) => {
      const { playlistId, videoId } = req.params;
      //find playlistId and videoId are validate
      //find playlist and add videoId
      //return res

      if (!isValidObjectId(playlistId) && isValidObjectId(videoId)) {
            return res
                  .status(400)
                  .json(
                        new ApiError(
                              400,
                              "playlistId and videoId are not valid"
                        )
                  );
      }

      const playList = await PlayList.findOne({ _id: playlistId });
      if (!playList) {
            return res
                  .status(404)
                  .json(new ApiError(404, "playlist are not found"));
      }

      if (playList.videos.includes(videoId)) {
            return res
                  .status(400)
                  .json(
                        new ApiError(
                              400,
                              "video are already present in playList"
                        )
                  );
      }

      playList.videos.push(videoId);

      playList.save({ validateBeforeSave: true });

      res.status(200).json(
            new ApiResponse(
                  200,
                  playList,
                  "add are video in playlist successfull"
            )
      );
});

const removeVideoFromPlaylist = asyncHandlers(async (req, res) => {
      const { playlistId, videoId } = req.params;
      // TODO: remove video from playlist
});

const deletePlaylist = asyncHandlers(async (req, res) => {
      const { playlistId } = req.params;
      // FIXME: delete playlist

      if (!isValidObjectId(playlistId)) {
            return res
                  .status(404)
                  .json(new ApiError(404, "playlistId are not valid"));
      }

      const playList = await PlayList.findByIdAndDelete(playlistId);

      res.status(200).json(
            new ApiResponse(200, playList, "playlist are delete successfully")
      );
});

const updatePlaylist = asyncHandlers(async (req, res) => {
      const { playlistId } = req.params;
      const { name, description } = req.body;
      //TODO: update playlist
});

export {
      createPlaylist,
      getUserPlaylists,
      getPlaylistById,
      addVideoToPlaylist,
      removeVideoFromPlaylist,
      deletePlaylist,
      updatePlaylist,
};
