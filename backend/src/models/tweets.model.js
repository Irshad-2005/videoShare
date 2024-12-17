import { Schema, model } from "mongoose";

const tweetsSchema = new Schema(
    {
        content: {
            type: String,
            require: true,
        },
        onwer: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

export const Tweet = model("Tweet", tweetsSchema);
