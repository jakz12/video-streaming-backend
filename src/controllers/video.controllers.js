import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler( async (req, res) => {
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

const getAllVideos = asyncHandler( async (_, res) => {

    const videos = await Video.find({});

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
})

const getVideoById = asyncHandler( async (req, res) => { 
    const { videoID } = req.body;
    const video = await Video.findById(videoID);

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")   
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    //check is user have a rights have to delete
    const video = await Video.findById(videoId); 
    if(!(video?.owner.equals(req.user?._id))){
        throw new ApiError(400, "current user doesn't have a right to delete a video")
    }

    await Video.findByIdAndDelete(videoId);

    res.status(200).json(
        new ApiResponse(200, {}, "Video Deleted succesfully")
    );
})

export { publishAVideo, getAllVideos, getVideoById, deleteVideo }