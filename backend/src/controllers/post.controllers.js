import { Post } from "../models/post.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


// controller for creating a post 
const createPost = asyncHandler(async (req, res)=>{
    const { text, hashTags } = req.body;
    const imageLocalPath = req.file?.path;

    if((!text || text?.trim()==="") && (!imageLocalPath)){
        throw new ApiError(400, 'Atleast one field required text or image')
    }

    let hashTagArray;
    if(hashTags){
        hashTagArray=hashTags?.trim()?.split(" ")
    }

    let image;
    if(imageLocalPath){
        image = await uploadOnCloudinary(imageLocalPath)

        if(!image.url){
            throw new ApiError(500, "failed to upload image")
        }
    }

    const post = await Post.create({
        owner: req.user?._id,
        text: text || "",
        image: image?.url,
        hashTags: hashTagArray || []
    })

    if(!post){
        throw new ApiError(500, "Error while creating post")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "Post created successfully")
    )

});

// controller for updating post
const updatePost = asyncHandler(async (req, res)=>{
    const {text} = req.body;
    const {postId} = req.params;

    if(!postId || postId?.trim()===""){
        throw new ApiError(400, "Post id not found")
    }

    const post = await Post.findById(postId);

    if(!post){
        throw new ApiError(404, "post doesn't exist")
    }

    if(String(post.owner)!==String(req.user?._id)){
        throw new ApiError(403, "You are not authorized to update this post")
    }

    post.text=text;

    const updatedPost = await post.save(); 

    if(!updatedPost){
        throw new ApiError(500, "Failed to update the post")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedPost, "post updated successfully")
    )
    
});

// controller for deleting post
const deletePost = asyncHandler(async (req, res)=>{
    const {postId} = req.params;

    if(!postId || postId?.trim()===""){
        throw new ApiError(400, "Post id not found")
    }

    const post = await Post.findById(postId);

    if(!post){
        throw new ApiError(404, "post doesn't exist")
    }

    if(String(post.owner)!==String(req.user?._id)){
        throw new ApiError(403, "You are not authorized to delete this post")
    }

    const deletedPost = await Post.findByIdAndDelete(postId); 

    if(!deletedPost){
        throw new ApiError(500, "Failed to delete the post")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedPost, "post updated successfully")
    )
    
});

// controller for search post based on certain text
const getPostBasedOnText = asyncHandler(async (req, res)=>{
    const {searchText} = req.params;

    if(!searchText || searchText?.trim()===""){
        throw new ApiError(400, "search text not found")
    }

    const post = await Post.find({
        text: {
            $regex: new RegExp(searchText, 'i')
        }
    })

    if(!post){
        throw new ApiError(404, "no post found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "post fetched successfully")
    )
    
});

// controller for search post based on hashtags
const getPostByHashtag = asyncHandler(async (req, res)=>{
    const {hashtag} = req.params;

    if(!hashtag || hashtag?.trim()===""){
        throw new ApiError(400, "hashtag not found")
    }

    const post = await Post.find({
        hashTags: hashtag
    })

    if(!post){
        throw new ApiError(404, "no post found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "post fetched successfully")
    )
    
});

// controller for get all post
const getAllPost = asyncHandler(async (req, res)=>{
    
    const post = await Post.find()

    if(!post){
        throw new ApiError(404, "no post found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, post, "post fetched successfully")
    )
    
});

export {
    createPost,
    updatePost,
    deletePost,
    getPostBasedOnText,
    getPostByHashtag,
    getAllPost
}