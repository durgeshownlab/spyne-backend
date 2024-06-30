import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};
    } 
    catch (error) {
        throw new ApiError(500, "something went wrong while generating the access and refresh token")
    }
}

// controller for create user
const registerUser = asyncHandler(async (req, res)=>{
    const {name, userName, email, mobile, password} = req.body;

    if(!name || name?.trim()===""){
        throw new ApiError(400, "Name field is required")
    }
    if(!userName || userName?.trim()===""){
        throw new ApiError(400, "Username field is required")
    }
    if(!email || email?.trim()===""){
        throw new ApiError(400, "Email field is required")
    }
    if(!mobile || mobile?.trim()===""){
        throw new ApiError(400, "Mobile field is required")
    }
    if(!password || password?.trim()===""){
        throw new ApiError(400, "Password field is required")
    }

    const existingUser = await User.findOne(
        {
            $or: [{userName}, {email}, {mobile}]
        }
    )

    if(existingUser){
        throw new ApiError(400, "User already exist")
    }

    const newUser = await User.create({
        name,
        userName: userName.toLowerCase(),
        email: email.toLowerCase(),
        mobile,
        password
    })

    if(!newUser) {
        throw new ApiError(500, "Error While creating user")
    }

    const createdUser = await User.findById(newUser?._id).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User created successfully")
    )

});

// controller for login user 
const loginUser = asyncHandler(async (req, res)=>{
    const {email, password} = req.body;
   
    if(!email || email?.trim()===""){
        throw new ApiError(400, "Email is required")
    }
    if(!password || password?.trim()===""){
        throw new ApiError(400, "Password is required")
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "user doesn't exist")
    }
    const isPasswordValid = user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
   
    return res 
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
    )

});

// controller for logout user 
const logoutUser = asyncHandler(async (req, res)=>{
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, null, 'User loged out successfully')
    )
});

// controller for update user 
const updateUser = asyncHandler(async (req, res)=>{
    const {name, email, userName, mobile} = req.body;

    const user = await User.findById(req.user?._id)

    const validateUser = await User.findOne({
        $and: [
            {_id: {$ne: req.user._id}},
            {
                $or: [
                    {email},
                    {mobile},
                    {userName}
                ]
            }
        ]
    })

    if(validateUser){
        throw new ApiError(400, "User already exist with that email , mobile or username")
    }

    if(!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    if(name && name?.trim()!==""){
        user.name = name;
    }

    if(email && email?.trim()!==""){
        user.email = email.toLowerCase();
    }

    if(userName && userName?.trim()!==""){
        user.userName = userName.toLowerCase();
    }

    if(mobile && mobile?.trim()!==""){
        user.mobile = mobile;
    }

    await user.save({validateBeforeSave: false})

    const updatedUser = await User.findById(req.user?._id).select("-password -refreshToken")

    if(!updatedUser) {
        throw new ApiError(500, "Error while updating the user details")
    }

    return res   
    .status(200)
    .json(
        new ApiResponse(200, updatedUser, "User updated successfully")
    )

});

// controller for deleting the user
const deleteUser = asyncHandler(async (req, res)=>{
    const deletedUser = await User.findByIdAndDelete(req.user?._id)

    if(!deletedUser){
        throw new ApiError(500, "Error while deleting the user")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, deletedUser, "User deleted successfully")
    )
});
    
// controller for showing list of users 
const getListOfUsers = asyncHandler(async (req, res)=>{
    const allUser = await User.find().select("-password -refreshToken");

    return res
    .status(200)
    .json(
        new ApiResponse(200, allUser, "All user fetched successfully")
    )

})

// controller for  getting all the user by name  
const getUserByName = asyncHandler(async (req, res)=>{
    const {name} = req.params;

    if(!name || name?.trim()===""){
        throw new ApiError(400, "Name not found")
    }

    const user = await User.find({
        name: { $regex: new RegExp(name, 'i') }
    }).select("-password -refreshToken")

    if(!user){
        throw new ApiError(404, 'No user found')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getListOfUsers,
    getUserByName
}