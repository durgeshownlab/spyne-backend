import { Comment } from "../models/comment.models.js";
import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// controller for geting the all comments for post
const getCommentForPost = asyncHandler(async (req, res)=>{
    const {postId} = req.params;

    if(!postId || postId.trim()===""){
        throw new ApiError(400, "Post id not found")
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post doesn't exist");
    }

    const comment = await Comment.find({
        post: postId
    })

    if(!comment){
        throw new ApiError(404, "No comment found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment fetched successfully for post")
    )
});

// controller for geting the all comments for comment
const getCommentForComment = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;

    if(!commentId || commentId.trim()===""){
        throw new ApiError(400, "Comment id not found")
    }

    const parentComment = await Comment.findById(commentId);
    if(!parentComment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    const comment = await Comment.find({
        comment: commentId
    })

    if(!comment){
        throw new ApiError(404, "No comment found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment fetched successfully for post")
    )
});

// controller for commenting on post
const postCommentOnPost = asyncHandler(async (req, res)=>{
    const {postId} = req.params;
    const {text} = req.body;

    if(!postId || postId.trim()===""){
        throw new ApiError(400, "Post id not found")
    }
    if(!text || text.trim()===""){
        throw new ApiError(400, "Comment text not found")
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404, "Post doesn't exist");
    }

    const comment = await Comment.create({
        owner: req.user?._id,
        post: postId,
        text: text
    })

    if(!comment){
        throw new ApiError(500, "Error while commenting");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Commented successfully on post")
    )
});

// controller for commenting on comment
const postCommentOnComment = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;
    const {text} = req.body;

    if(!commentId || commentId.trim()===""){
        throw new ApiError(400, "Comment id not found")
    }
    if(!text || text.trim()===""){
        throw new ApiError(400, "Comment text not found")
    }

    const parentComment = await Comment.findById(commentId);
    if(!parentComment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    const comment = await Comment.create({
        owner: req.user?._id,
        comment: commentId,
        text: text
    })

    if(!comment){
        throw new ApiError(500, "Error while commenting");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Commented successfully on comment")
    )
});

// controller for updating comment
const updateComment = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;
    const {text} = req.body;

    if(!commentId || commentId.trim()===""){
        throw new ApiError(400, "Comment id not found")
    }
    if(!text || text.trim()===""){
        throw new ApiError(400, "Comment text not found")
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    if(String(comment.owner)!==String(req.user?._id)){
        throw new ApiError(403, "You are not authorised to update this comment");
    }

    comment.text=text;

    const updatedComment = await comment.save({validateBeforeSave: false});
    if(!updatedComment){
        throw new ApiError(500, "Error while updating comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
});

// controller for deleting comment
const deleteComment = asyncHandler(async (req, res)=>{
    const {commentId} = req.params;

    if(!commentId || commentId.trim()===""){
        throw new ApiError(400, "Comment id not found")
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404, "Comment doesn't exist");
    }

    if(String(comment.owner)!==String(req.user?._id)){
        throw new ApiError(403, "You are not authorised to delete this comment");
    }

    const deletedComment =await Comment.findByIdAndDelete(commentId)
    if(!deletedComment){
        throw new ApiError(500, "Error while deleting comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
    )
});


export {
    postCommentOnPost,
    postCommentOnComment,
    updateComment,
    deleteComment,
    getCommentForPost,
    getCommentForComment
}