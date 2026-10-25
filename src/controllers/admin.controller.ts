import type { Request, Response } from "express";
import * as adminService from "../services/admin.service.js";

export const listUsers = async (req: Request, res: Response) => {
  res.json(await adminService.listUsers(res.locals.query));
};

export const setUserStatus = async (req: Request, res: Response) => {
  const user = await adminService.setUserStatus(req.params.id as string, req.body.isActive);
  res.json(user);
};

export const listPosts = async (req: Request, res: Response) => {
  res.json(await adminService.listAllPosts(res.locals.query));
};

export const deletePost = async (req: Request, res: Response) => {
  await adminService.deleteAnyPost(req.params.id as string);
  res.status(204).send();
};
