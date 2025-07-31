import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";

class UserController {
	public createUser: RequestHandler = async (req: Request, res: Response) => {
		console.log(req.body, "req.body");
		const serviceResponse = await userService.create(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await userService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
