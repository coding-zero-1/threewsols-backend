import type { Request, Response } from "express";
import { v2, type UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

// Helper function to upload an image buffer to Cloudinary
function uploadToCloudinary(
  buffer: Buffer,
  folder = "posts"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = v2.uploader.upload_stream(
      {
        folder, // Specify the folder where the image will be stored in Cloudinary
        resource_type: "image", // Specify the resource type as an image
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }], // Optimize image quality and format
      },
      (error, result) => {
        if (error) return reject(error); // Reject the promise if an error occurs
        if (!result) return reject(new Error("Cloudinary returned no result")); // Handle unexpected null result
        resolve(result as UploadApiResponse); // Resolve the promise with the upload result
      }
    );

    // Create a readable stream from the buffer and pipe it to the upload stream
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Controller to handle post upload requests
export const postUploadController = async (req: Request, res: Response) => {
  try {
    const { content } = req.body; // Extract content and author from the request body
    // @ts-ignore
    const userInDb = await UserModel.findById(req.user.email);
    const name = userInDb ? userInDb.name : "Unknown";
    let imageUrl = null;
    let cloudinaryId = null;

    if (req.file) {
      // If an image file is provided in the request
      const result = await uploadToCloudinary(req.file.buffer, "myApp/posts"); // Upload the image to Cloudinary
      imageUrl = result.secure_url; // Get the secure URL of the uploaded image
      cloudinaryId = result.public_id; // Get the public ID of the uploaded image
    }

    // Create a new post in the database
    const post = await PostModel.create({
      content,
      imageUrl,
      cloudinaryId,
      author: name,
    });

    // Respond with a success message and the created post
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    // Handle errors and respond with an appropriate error message
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
};