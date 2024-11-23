import asyncHandlers from "../utils/asyncHandlers.js";
import { registerValidator } from "../utils/validator.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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
        $or: [({ email: email }, { username: username })],
    });
    if (existsUser) {
        throw res
            .status(400)
            .json(new ApiError(400, "user are already exists"));
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
        throw res
            .status(400)
            .json(new ApiError(400, "Avatar file is required"));
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw res
            .status(400)
            .json(new ApiError(400, "avatar file is required"));
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
        "-password -refreshToken"
    );
    if (!createUser) {
        throw res
            .status(500)
            .json(
                new ApiError(
                    500,
                    "some thing went wrong while registering user "
                )
            );
    }

    res.status(201).json(
        new ApiResponse(201, createUser, "user registered successfully ")
    );
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

    const data = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, data, "logIn are successfully"));
});

const logOutUser = asyncHandlers(async (req, res) => {
    const user = req.user;
    await User.findByIdAndUpdate(
        user._id,
        {
            $unset: {
                refreshToken: 1, // remove the this field from document
            },
        },
        {
            new: true,
        }
    );
    res.clearCookie("accessToken", options)
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
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodeUser._id);
        if (!user) {
            throw res
                .status(404)
                .json(new ApiError(404, "Invalid Refresh Token"));
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

        res.cookie("acessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    { accessToken, refreshToken },
                    "refresh token are generate sucessfully.."
                )
            );
    } catch (error) {
        res.status(401).json(
            new ApiError(401, error?.message || "something went wrong")
        );
    }
});

export { userRegiter, logInUser, logOutUser, updateRefreshTokenUser };
