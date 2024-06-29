import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const postSchema = new mongoose.Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        text: {
            type: String,
            index: true,
        },
        image: {
            type: String,
            index: true,
        },
        hashTags: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
)

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema)