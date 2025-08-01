import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";

class UserController {
	public createUser: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.create(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	}

	public loginUser: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await userService.login(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse)
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

	public blockUsers: RequestHandler = async (req: Request, res: Response) => {
		const { ids } = req.body as { ids: number[] };
		const serviceResponse = await userService.blockUsers(ids);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public unblockUsers: RequestHandler = async (req: Request, res: Response) => {
		const { ids } = req.body as { ids: number[] };
		const serviceResponse = await userService.unblockUsers(ids);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteUsers: RequestHandler = async (req: Request, res: Response) => {
		const { ids } = req.body as { ids: number[] };
		const serviceResponse = await userService.deleteUsers(ids);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const userController = new UserController();
