import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
        },
        channel: {
            type: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
    }
);

export const Subscription = model("Subscription", subscriptionSchema);
