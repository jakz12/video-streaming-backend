import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description, duration} = req.body;
        if((title && description).trim() === ""){
            throw new ApiError(400, "title and description required"); 
        }
        if(!duration){
            throw new ApiError(400, "Duration of video is required"); 
        }
    
        const videoLocalPath = req.files?.videoFile[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    
        if(!videoLocalPath){
            throw new ApiError(400, "Video file is required");
        }
        
        if(!thumbnailLocalPath){
            throw new ApiError(400, "Thumbnail file is required");
        }
    
        const videoFile = await uploadOnCloudinary(videoLocalPath);
        const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
    
        if(!videoFile){
            throw new ApiError(400, "Video file is required");
        }
        
        if(!thumbnailFile){
            throw new ApiError(400, "Thumbnail file is required");
        }
    
        const video = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnailFile.url,
            owner: req.user?._id,
            title,
            description,
            duration
        });
    
        return res.status(200).json(
            new ApiResponse(200, video, "Video uploaded successfully")
        );
    } catch (error) {
        console.error("Error: ",error);
    }
})

export { publishAVideo }