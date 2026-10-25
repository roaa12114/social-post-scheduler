import Post from "../models/post.js";

type Status = "draft" | "scheduled" | "published" | "failed";

export const createPost = async (userId: string, data: { content: string }) => {
  return Post.create({ user: userId, content: data.content });
};

export const listPosts = async (
  userId: string,
  { status, page, limit }: { status?: Status; page: number; limit: number },
) => {
  const filter: Record<string, unknown> = { user: userId };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(filter),
  ]);
  return { items, page, limit, total };
};

export const getPost = async (userId: string, id: string) => {
  const post = await Post.findOne({ _id: id, user: userId });
  if (!post) {
    const err: any = new Error("Post not found");
    err.status = 404;
    throw err;
  }
  return post;
};

export const deletePost = async (userId: string, id: string) => {
  await getPost(userId, id);
  await Post.deleteOne({ _id: id, user: userId });
};

export const updatePost = async (userId: string, id: string, data: { content: string }) => {
  const post = await getPost(userId, id);

  if (post.status === "published") {
    const err: any = new Error("Published posts cannot be edited");
    err.status = 409;
    throw err;
  }

  post.content = data.content;
  return post.save();
};

export const schedulePost = async (userId: string, id: string, scheduledAt: Date) => {
  const post = await getPost(userId, id);

  if (post.status !== "draft") {
    const err: any = new Error("Only draft posts can be scheduled");
    err.status = 409;
    throw err;
  }
  if (scheduledAt <= new Date()) {
    const err: any = new Error("scheduledAt must be in the future");
    err.status = 422;
    throw err;
  }

  post.status = "scheduled";
  post.scheduledAt = scheduledAt;
  return post.save();
};
