import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, ModifyUsersSchema, UserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);


userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);


userRegistry.registerPath({
	method: "post",
	path: "/users/block",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: ModifyUsersSchema } } } },
	responses: createApiResponse(z.object({ success: z.boolean() }), "Success"),
});
userRouter.post("/block", validateRequest(ModifyUsersSchema), userController.blockUsers);

userRegistry.registerPath({
	method: "post",
	path: "/users/unblock",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: ModifyUsersSchema } } } },
	responses: createApiResponse(z.object({ success: z.boolean() }), "Success"),
});
userRouter.post("/unblock", validateRequest(ModifyUsersSchema), userController.unblockUsers);

userRegistry.registerPath({
	method: "post",
	path: "/users/delete",
	tags: ["User"],
	request: { body: { content: { "application/json": { schema: ModifyUsersSchema } } } },
	responses: createApiResponse(z.object({ success: z.boolean() }), "Success"),
});
userRouter.post("/delete", validateRequest(ModifyUsersSchema), userController.deleteUsers);
