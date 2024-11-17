import asyncHandlers from "../utils/asyncHandlers.js";
import { registerValidator } from "../utils/validator.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
        throw new ApiError(400, "user are already exists");
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
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "avatar file is required");
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
        throw new ApiError(
            500,
            "some thing went wrong while registering user "
        );
    }

    res.status(201).json(
        new ApiResponse(201, createUser, "user registered successfully ")
    );
});

export { userRegiter };
