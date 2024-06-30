import { Follow } from "../models/follow.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleFollow = asyncHandler(async (req, res)=>{
    const {userName} = req.params;

    if(!userName || userName.trim()===""){
        throw new ApiError(400, "Username not found");
    }

    const user = await User.findOne({
        userName: userName.toLowerCase()
    }).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404, "User doesn't exist");
    }

    const isFollowed = await Follow.findOne({
        followedBy: req.user?._id,
        followedTo: user._id
    });

    if(isFollowed){
        const unFollow = await Follow.findByIdAndDelete(isFollowed._id);
        if(!unFollow){
            throw new ApiError(500, "failed to unFollow the user")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, unFollow, "unFollow successfully")
        )
    }

    const follow = await Follow.create({
        followedBy: req.user?._id,
        followedTo: user._id
    });
    if(!follow){
        throw new ApiError(500, "failed to follow the user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, follow, "follow successfully")
    )

});

export {
    toggleFollow
}