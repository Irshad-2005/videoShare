import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandlers from "../utils/asyncHandlers.js";

const healthcheck = asyncHandlers(async (req, res) => {
	//FIXME: build a healthcheck response that simply returns the OK status as json with a message
	res.status(200).json(new ApiResponse(200, null, "OK "));
});

export { healthcheck };
