import { Schema, model } from "mongoose";

const playListsSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        description: {
            type: String,
            require: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "video",
            require: true,
        },
        onwer: {
            type: Schema.Types.ObjectId,
            ref: "user",
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

export const PlayLists = model("PlayLists", playListsSchema);
