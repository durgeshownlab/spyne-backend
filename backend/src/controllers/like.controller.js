import { Comment } from "../models/comment.models.js";
import { Like } from "../models/like.models.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// controller for toggeling the like unlike for post
const togglePostLike = asyncHandler(async (req, res)=>{
    const {postId} = req.params;
    if(!postId || postId.trim()===""){
        throw new ApiError(400, "Post id not found")
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post doesn't exist")
    }

    const like = await Like.find({
        owner: req.user?._id,
        post: postId
    })

    console.log("Like ", like)

    if(like && like.length!=0){
        const unliked = await Like.findByIdAndDelete(like[0]._id);
        if(!unliked){
            throw new ApiError(500, "failed to unlike the video")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, unliked, "video unliked")
        )
    }

    const liked = await Like.create({
        owner: req.user?._id,
        post: postId
    });
    if(!liked){
        throw new ApiError(500, "failed to like the video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, liked, "video liked")
    )

});

// controller for toggeling the like unlike for comment
const toggleCommentLike = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;
    if(!commentId || commentId.trim()===""){
        throw new ApiError(400, "Comment id not found")
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment doesn't exist")
    }

    const like = await Like.find({
        owner: req.user?._id,
        comment: commentId
    })

    if(like && like.length!=0){
        const unliked = await Like.findByIdAndDelete(like[0]._id);
        if(!unliked){
            throw new ApiError(500, "failed to unlike the comment")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, unliked, "comment unliked")
        )
    }

    const liked = await Like.create({
        owner: req.user?._id,
        comment: commentId
    });
    if(!liked){
        throw new ApiError(500, "failed to like the comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, liked, "comment liked")
    )

});

export {
    togglePostLike,
    toggleCommentLike
}