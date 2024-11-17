import validator from "validator";
import { ApiError } from "./ApiError.js";
const registerValidator = req;
{
    const { username, fullName, email, password } = req.body;

    if (!fullName) {
        throw new ApiError(400, "fullName is required");
    } else if (!username) {
        throw new ApiError(400, "username is required");
    } else if (validator.isEmail(email)) {
        throw new ApiError(400, "email are not valid");
    } else if (validator.isStrongPassword(password)) {
        throw new ApiError("password are not strong");
    }
}
export { registerValidator };
