import type { Request, Response } from "express";
import * as postService from "../services/post.service.js";

export const createPost = async (req: Request, res: Response) => {
  const userId = req.user!.sub;
  const { content } = req.body;
  const post = await postService.createPost(userId, { content });
  res.status(201).json(post);
};

export const listPosts = async (req: Request, res: Response) => {
const userId = req.user!.sub;
const { status, page, limit } = res.locals.query;
const result = await postService.listPosts(userId, { status, page, limit });
res.status(200).json(result);
}

export const getPost =  async (req: Request, res: Response) => {
  const post = await postService.getPost(req.user!.sub, req.params.id as string);
  res.status(200).json(post);
}

export const updatePost = async (req: Request, res: Response) => {
  const post = await postService.updatePost(
    req.user!.sub,
    req.params.id as string,
    { content: req.body.content },
  );
  res.status(200).json(post);
};

export const deletePost = async (req: Request, res: Response) => {
  await postService.deletePost(req.user!.sub, req.params.id as string);
  res.status(204).send();
};

export const schedulePost = async (req: Request, res: Response) => {
  const post = await postService.schedulePost(
    req.user!.sub,
    req.params.id as string,
    req.body.scheduledAt,
  );
  res.status(200).json(post);
};
