import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/users.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateRefreshTokenandAccessToken = async(userId)=>{
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({validateBeforeSave: false})

      return {accessToken, refreshToken};

      
   } catch (error) {
      throw new ApiError(500,"Something went wrong while generating access token and refresh token")
   }
}
const registerUser = asyncHandler(async(req,res)=>{
   //get user details from frontend
   //validation - not empty
   //check if user already exists:username, email
   //check for images, check for avatar
   //upload them to cloudinary, avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return response

   const {fullName, email,username, password,} = req.body;
   console.log("email: ",email);

   if([fullName, email, username, password].some((field)=> field?.trim()==="")){
      throw new ApiError(400, "All fields are required")


   }
   if(password.length<6){
      console.log("password is less than 6 character");
      throw new ApiError(400,"password should be greater than 6 character")
   }
   const existedUser = await User.findOne({
      $or:[{username},{email}]
      
   })
   
   if(existedUser){
      throw new ApiError(409, "User already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
   coverImageLocalPath = req.files.coverImage[0].path;
  }

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is required")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
      throw new ApiError(400, "Avatar file is required");
   }

   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()

   })
   const createdUser = await User.findById(user._id).select(" -password -refreshToken ")

   if(!createdUser){
      throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
   )



})

const loginUser = asyncHandler(async(req,res)=>{
   //req body-data
   //username or email
   //find the user
   //password check
   //access and refresh token
   //send cookie

   const {email,password,username} = req.body;
   if(!(email||username)){
      throw new ApiError(400, "Username or email is required")
   }

   const user = await User.findOne({
      $or:[{email},{username}]
   })

   if(!user){
      throw new ApiError(404, "User does not exists");
   }

   const isPasswordValid = await user.isPasswordCorrect(password);

   if(!isPasswordValid){
      throw new ApiError(401, "Invalid user Credentials")
   }

   const {accessToken, refreshToken} = await generateRefreshTokenandAccessToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
      httpOnly: true,
      secure: true
   }
   return res
   .status(200)
   .cookie("accessToken", accessToken, options )
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser,accessToken, refreshToken
         },
         "User logged In Successfully"
      )
   )

})

const logoutUser = asyncHandler(async(req, res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset:{
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
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))
})
 

const refreshAccessToken = asyncHandler(async(req,res)=>{

   try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if(!incomingRefreshToken){
         throw new ApiError(401, "Unauthorised request")
      }
   
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   
      const user = await User.findById(decodedToken._id);
      if(!user){
         throw new ApiError(401, "Invalid Refresh Token")
      }
   
      if(incomingRefreshToken!== user.refreshToken){
         throw new ApiError(401, "Refresh token is expired or already in use")
      }
   
      const {newAccessToken, refreshToken} = generateRefreshTokenandAccessToken(user._id);
      const options = {
         httpOnly:true,
         secure:true
      }
   
      return res
      .status(200)
      .cookie("accessToken",newAccessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
         new ApiResponse(
            200,
            {accessToken:newAccessToken, refreshToken},
            "Access Token refreshed"
   
         )
      )
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Refresh Token")
   }



})
export {
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken
}