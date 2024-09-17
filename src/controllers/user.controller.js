import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1 - take user details from frontend
  // 2 - validation
  // 3 - check if user already exists- email or username
  // 4 - check for avatar(must), check for images
  // 5 - upload on cloudinary, avatar
  // 6 - create use obj - create entry in db
  // 7 - remove password and refresh token from response
  // 8 - check for user creation
  // 9 - return response

  // 1
  const { fullName, email, password, username } = req.body;

  // 2
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    throw new ApiError(400, "Invalid email");
  }

  // 3
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this username or email already exists");
  }

  // 4
  if (!req.files?.avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files.coverImage
    ? `${req.files.coverImage[0]?.path}`
    : null;

  // 5
  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar on cloudinary");
  }

  // 6
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // 7 and 8
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "error while registering user");
  }

  // 9
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully. Now you can login"
      )
    );
});

export { registerUser };
