import User from "../models/user.js";
import Post from "../models/post.js";

const notFound = (msg: string) => {
  const err: any = new Error(msg);
  err.status = 404;
  return err;
};

export const listUsers = async ({ page, limit }: { page: number; limit: number }) => {
  const [items, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(),
  ]);
  return { items, page, limit, total };
};

export const setUserStatus = async (id: string, isActive: boolean) => {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) throw notFound("User not found");
  return user;
};

export const listAllPosts = async ({ status, page, limit }: { status?: string; page: number; limit: number }) => {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  const [items, total] = await Promise.all([
    Post.find(filter).populate("user", "email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Post.countDocuments(filter),
  ]);
  return { items, page, limit, total };
};

export const deleteAnyPost = async (id: string) => {
  const post = await Post.findByIdAndDelete(id);
  if (!post) throw notFound("Post not found");
};
