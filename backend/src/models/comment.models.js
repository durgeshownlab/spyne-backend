import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Comment = mongoose.model("Comment", commentSchema)