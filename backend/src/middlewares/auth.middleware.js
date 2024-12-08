import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw res
                .status(401)
                .json(new ApiError(401, "Access token are required "));
        }

        const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decode) {
            throw res
                .status(401)
                .json(new ApiError(401, "Invalid acess token "));
        }

        const user = await User.findById(decode._id);

        req.user = user;

        next();
    } catch (error) {
        throw res
            .status(401)
            .json(new ApiError(401, error?.message || "something went wrong "));
    }
};
