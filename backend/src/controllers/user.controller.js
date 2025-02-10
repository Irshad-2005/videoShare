import asyncHandlers from "../utils/asyncHandlers.js";
import { registerValidator } from "../utils/validator.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

const options = { httpOnly: true, secure: true };

const generateAccessTokenAndRefreshToken = async (_id) => {
	const user = await User.findById(_id);

	const accessToken = await user.generateAccessToken();

	const refreshToken = await user.generateRefreshToken();

	user.refreshToken = refreshToken;

	await user.save({ validateBeforeSave: true });

	return {
		accessToken,
		refreshToken,
	};
};

const userRegiter = asyncHandlers(async (req, res) => {
	// get the user details
	// validate user detailt - not empty
	// user are exist or not
	// avatar path is present or not
	// uploaded avatar image on cloudinary
	// check avatar image are upload sucessfully cloudinary
	// create a user to db
	// if check user are create or not
	// remove password and refreshToken on user response
	// return response

	const { username, fullName, email, password } = req.body;

	registerValidator(req);

	const existsUser = await User.findOne({
		$or: [{ email: email }, { username: username }],
	});
	if (existsUser) {
		throw res.status(400).json(new ApiError(400, "user are already exists"));
	}
	//console.log(req.files);

	const avatarLocalPath = req.files?.avatar[0]?.path;
	// const coverImageLocalPath = req.files?.coverImage[0]?.path;
	let coverImageLocalPath;
	if (
		req.files &&
		Array.isArray(req.files.coverImage) &&
		req.files.coverImage.length > 0
	) {
		coverImageLocalPath = req.files.coverImage[0].path;
	}

	if (!avatarLocalPath) {
		throw res.status(400).json(new ApiError(400, "Avatar file is required"));
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);
	if (!avatar) {
		throw res.status(400).json(new ApiError(400, "avatar file is required"));
	}
	const user = await User.create({
		username,
		email,
		password,
		fullName,
		avatar: avatar.url,
		coverImage: coverImage?.url || "",
	});

	const createUser = await User.findById(user._id).select(
		"-password -refreshToken",
	);
	if (!createUser) {
		throw res
			.status(500)
			.json(new ApiError(500, "some thing went wrong while registering user "));
	}

	res
		.status(201)
		.json(new ApiResponse(201, createUser, "user registered successfully "));
});

const logInUser = asyncHandlers(async (req, res) => {
	// get all detail in req body -> email , username , password
	// validate email or username are not empty
	// find by user in db with email or username
	// if check password are corrent or not
	// generate access token or refresh token
	// return res send access token or refresh token

	const { email, username, password } = req.body;

	if (!(email || username)) {
		throw res.json(new ApiError(401, "username or email are required "));
	}

	const user = await User.findOne({
		$or: [{ email }, { username }],
	});

	if (!user) {
		throw res
			.status(404)
			.json(new ApiError(404, "username or email are not valid"));
	}

	const isPassword = await user.isCorrectPassword(password);

	if (!isPassword) {
		throw res.status(401).json(new ApiError(401, "password are not valid"));
	}

	const { accessToken, refreshToken } =
		await generateAccessTokenAndRefreshToken(user._id);

	const data = await User.findById(user._id).select("-password -refreshToken");

	res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(new ApiResponse(200, data, "logIn are successfully"));
});

const logOutUser = asyncHandlers(async (req, res) => {
	const user = req?.user;
	//console.log(user);
	await User.findByIdAndUpdate(
		user._id,
		{
			$unset: {
				refreshToken: 1, // remove the this field from document
			},
		},
		{
			new: true,
		},
	);
	res
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "Logout sucessfully"));
});

const updateRefreshTokenUser = asyncHandlers(async (req, res) => {
	// get refresh Token in user and validate token
	// find user
	// check are incoming refreshToken are equal to user refresh Token
	// generate accessToken and refreshToken or setCookie
	// return res sucessfully generate token

	try {
		const incomingToken = req?.cookies?.refreshToken;
		if (!incomingToken) {
			throw res
				.status(401)
				.json(new ApiError(401, "Refresh token are required"));
		}
		const decodeUser = jwt.verify(
			incomingToken,
			process.env.REFRESH_TOKEN_SECRET,
		);

		const user = await User.findById(decodeUser._id);
		if (!user) {
			throw res.status(404).json(new ApiError(404, "Invalid Refresh Token"));
		}

		if (incomingToken !== user?.refreshToken) {
			throw res
				.status(401)
				.json(new ApiError(401, "refresh token is expired or used "));
		}
		const { accessToken, refreshToken } =
			await generateAccessTokenAndRefreshToken(user._id);

		user.refreshToken = refreshToken;

		user.save({ validateBeforeSave: true });

		res
			.cookie("acessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.status(201)
			.json(
				new ApiResponse(
					201,
					{ accessToken, refreshToken },
					"refresh token are generate sucessfully..",
				),
			);
	} catch (error) {
		res
			.status(401)
			.json(new ApiError(401, error?.message || "something went wrong"));
	}
});

const changeUserPassword = asyncHandlers(async (req, res) => {
	// get to oldPassword and newPassword
	// validate password are not empty
	// get current user
	// check oldpassword are corrent or not
	// change the oldpassword to newPassword
	// return res password are change sucessfully

	const { oldPassword, newPassword } = req.body;

	if (!validator.isStrongPassword(newPassword)) {
		throw res.status(400).json(new ApiError(400, "enter strong password"));
	}

	const currentUser = req.user;

	const user = await User.findById(currentUser._id);

	const isPassword = await user.isCorrectPassword(oldPassword);

	if (!isPassword) {
		throw res.status(404).json(new ApiError(404, "Invalid Password"));
	}

	user.password = newPassword;

	await user.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Password are change sucessfully"));
});

const updateUserAccountDetail = asyncHandlers(async (req, res) => {
	// get are updated detail and validate details
	// get current user detail
	//check are detail are allow or not
	// update detail
	// return res new detail

	const { fullName, email } = req.body;

	const Allow_Updation = ["fullName", "email"];

	if (!Object.keys(req.body).every((key) => Allow_Updation.includes(key))) {
		throw res.status(400).json(new ApiError(400, "updation are not allow"));
	}

	if (!(fullName || email)) {
		throw res
			.status(400)
			.json(new ApiError(400, "fullName or email required "));
	}

	const currentUser = req.user;

	const user = await User.findByIdAndUpdate(
		currentUser._id,
		{
			$set: {
				fullName,
				email,
			},
		},
		{ new: true },
	).select("-password -refreshToken");

	return res
		.status(200)
		.json(new ApiResponse(200, user, "updation are sucessfully"));
});
const getUserProfile = asyncHandlers(async (req, res) => {
	// get user into req
	// return user detailt
	const reqUser = req?.user;
	const newUser = await User.findById(reqUser?._id).select(
		"-password -refreshToken",
	);
	return res
		.status(200)
		.json(new ApiResponse(200, newUser, "user fetched sucessfully"));
});
const updateUserAvatar = asyncHandlers(async (req, res) => {
	// get currentUser
	// get avatarpath or validate
	// upload cloudinary
	// update user avatar
	// return res

	const currentUser = req.user;

	const avatarLocalPath = req.file?.path;

	// console.log(avatarLocalPath);

	if (!avatarLocalPath) {
		throw res.status(400).json(new ApiError(400, "avatar are present"));
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);

	//console.log(avatar.url);
	if (!avatar?.url) {
		throw res.status(400).json(new ApiError("avatar are required"));
	}
	const oldURL = currentUser.avatar;
	const data = await User.findByIdAndUpdate(
		currentUser._id,
		{
			$set: {
				avatar: avatar?.url,
			},
		},
		{
			new: true,
		},
	);
	await deleteOnCloudinary(oldURL);
	return res
		.status(200)
		.json(new ApiResponse(200, data, "Avatar are update sucessfully"));
});
const updateUserCoverImage = asyncHandlers(async (req, res) => {
	// get user detail
	// get coverImage path
	// upload on cloudinary
	// update into db
	// return res

	const currentUser = req.user;

	const coverImageLocalPath = req?.file?.path;
	//console.log(coverImageLocalPath);
	if (!coverImageLocalPath) {
		return res
			.status(400)
			.json(new ApiError(400, "coverImage are not present "));
	}
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);

	if (!coverImage?.url) {
		return res.status(500).json(new ApiError(500, "coverImage are missing "));
	}
	const oldURL = currentUser?.coverImage;
	const data = await User.findByIdAndUpdate(
		currentUser._id,

		{
			$set: {
				coverImage: coverImage?.url,
			},
		},

		{ new: true },
	).select("-password -refreshToken -createdAt ");
	if (oldURL) {
		deleteOnCloudinary(oldURL);
	}
	return res
		.status(200)
		.json(new ApiResponse(200, data, "coverImage are update sucessfully"));
});
const getUserChannelProfile = asyncHandlers(async (req, res) => {
	// match username in aggregate
	// lookup subscriptions model and get subscribers
	// lookup subscriptions model and get subscribedTo

	const { username } = req.params;
	console.log(username);
	const channel = await User.aggregate([
		{
			$match: {
				username,
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscribers",
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "subscriber",
				as: "subscribedTo",
			},
		},
		{
			$addFields: {
				subscriberCount: {
					$size: "$subscribers",
				},
				subscribedToCount: {
					$size: "$subscribedTo",
				},
				isSubsribedTo: {
					$cond: {
						if: {
							$in: [req?._id, "$subscribers.subscriber"],
						},
						
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$project: {
				subscriberCount: 1,
				subscribedToCount: 1,
				isSubsribedTo: 1,
				username: 1,
				email: 1,
				fullName: 1,
				avatar: 1,
				coverImage: 1,
			},
		},
	]);
	console.log(channel);
	if (!channel?.length) {
		res.status(404).json(new ApiError(404, "username are not found"));
	}
	// console.log(channel);

	return res
		.status(200)
		.json(
			new ApiResponse(200, channel[0], "channel profile fetched sucessfully"),
		);
});
const getWatchHistory = asyncHandlers(async (req, res) => {
	// match userId
	// add lookup to video model and get video
	//add sublookup and get onwer

	const user = await User.aggregate([
		{
			$match: {
				_id: new mongoose.Types.ObjectId(req.user._id),
			},
		},
		{
			$lookup: {
				from: "videos",
				localField: "watchHistory",
				foreignField: "_id",
				as: "watchHistory",
				pipeline: [
					{
						$lookup: {
							from: "user",
							localField: "owner",
							foreignField: "_id",
							as: "owner",
							pipeline: [
								{
									$project: {
										fullName: 1,
										username: 1,
										avatar: 1,
									},
								},
							],
						},
					},
					{
						$addFields: {
							owner: {
								$first: "$owner",
							},
						},
					},
				],
			},
		},
	]);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				user[0].watchHistory,
				"user fetched sucessfull watchHistory",
			),
		);
});
export {
	userRegiter,
	logInUser,
	logOutUser,
	updateRefreshTokenUser,
	changeUserPassword,
	updateUserAccountDetail,
	updateUserAvatar,
	updateUserCoverImage,
	getUserProfile,
	getUserChannelProfile,
	getWatchHistory,
};
