import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: { type: String},
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  comments: [{ type: String }],
  author : { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },

},{timestamps: true});

const PostModel = mongoose.model("Posts", postSchema);

export default PostModel;