import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CreateUserSchema, LoginUserSchema, UserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { authController } from "./authController";


export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", UserSchema);

authRegistry.registerPath({
    method: "post",
    path: "/register",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateUserSchema,
                },
            }
        }
    },
    responses: createApiResponse(UserSchema, "Success"),
});

authRouter.post("/register", validateRequest(CreateUserSchema), authController.createUser);

authRegistry.registerPath({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: LoginUserSchema,
                },
            },
        }
    },
    responses: createApiResponse((UserSchema), "Success"),
})

authRouter.post("/login", validateRequest(LoginUserSchema), authController.loginUser);

