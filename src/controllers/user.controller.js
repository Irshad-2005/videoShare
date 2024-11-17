import asyncHandlers from "../utils/asyncHandlers.js";

const userRegiter = asyncHandlers(async (req, res) => {
    res.status(200).json({ message: "Irshad Ali" });
});

export { userRegiter };
