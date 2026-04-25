import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const filter = {}
  filter.$or =[
      {title: {$regex: query, $options: "i"}},
      {description: {$regex: query, $options: "i"}}
    ]
  if(userId){
    filter.owner = userId
  }

  const allowedSortFields = ["views", "createdAt"]
  const allowedSortTypes = ["asc", "desc"]

  const finalSortBy = allowedSortFields.includes(sortBy)? sortBy: "views";
  const finalSortType = allowedSortTypes.includes(sortType)? sortType: "desc";

  const direction = finalSortType === "asc" ? 1: -1

  const sort = {};
  sort[finalSortBy] = direction

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const skip = (pageNum - 1)* limitNum

  const result = await Video.find(filter).sort(sort).skip(skip).limit(limitNum);

  return res
  .status(200)
  .json(
    new ApiResponse(200, result, "Videos fetched successfully")
  )

});
