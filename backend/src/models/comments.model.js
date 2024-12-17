import { Schema, model } from "mongoose";
const commentSchema = new Schema(
    {
        content: {
            type: String,
            require: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            require: true,
        },
        onwer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = model("Comment", commentSchema);
