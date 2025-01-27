import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweets.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";

const createTweet = asyncHandlers(async (req, res) => {
      //FIXME: create tweet

      const { tweet } = req.body;

      if (!tweet) {
            return res
                  .status(400)
                  .json(new ApiError(400, "tweet are required"));
      }

      const newTweet = await Tweet.create({
            content: tweet,
            onwer: req.user._id,
      });

      res.status(201).json(
            new ApiResponse(201, newTweet, "tweet are create successfully")
      );
});

const getUserTweets = asyncHandlers(async (req, res) => {
      // TODO: get user tweets
});

const updateTweet = asyncHandlers(async (req, res) => {
      //FIXME: update tweet
      //find the tweetId and validate
      //update tweet content
      //retuen res
      const { tweetId } = req.params;
      const { updateTweet } = req.body;
      if (!isValidObjectId(tweetId)) {
            return res
                  .status(400)
                  .json(new ApiError(400, "tweetId are not valid"));
      }

      const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { content: updateTweet },
            { new: true }
      );

      res.status(200).json(
            new ApiResponse(200, updatedTweet, "tweet are updated successfully")
      );
});

const deleteTweet = asyncHandlers(async (req, res) => {
      //FIXME: delete tweet
      const { tweetId } = req.params;

      if (!isValidObjectId(tweetId)) {
            return res
                  .status(400)
                  .json(new ApiError(400, "tweetId are not valid"));
      }

      const deleteTweet = await Tweet.findByIdAndDelete(tweetId);

      res.status(200).json(
            new ApiResponse(200, deleteTweet, "tweet are delete successfully")
      );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
