import Post from "../models/post.js";

export const publishDuePosts = async () => {
  const now = new Date();
  const result = await Post.updateMany(
    { status: "scheduled", scheduledAt: { $lte: now } },
    { $set: { status: "published", publishedAt: now } },
  );
  return result.modifiedCount;
};
