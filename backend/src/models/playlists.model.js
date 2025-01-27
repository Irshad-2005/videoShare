import { Schema, model } from "mongoose";

const playListSchema = new Schema(
      {
            name: {
                  type: String,
                  require: true,
            },
            description: {
                  type: String,
                  require: true,
            },
            videos: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: "video",
                  },
            ],
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

export const PlayList = model("PlayList", playListSchema);
