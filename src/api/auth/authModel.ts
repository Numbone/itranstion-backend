import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type Create = z.infer<typeof CreateUserSchema>;
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;
export type Login=z.infer<typeof LoginUserSchema>
export type LoginBody=z.infer<typeof LoginBodySchema>
export type ModifyUsers=z.infer<typeof ModifyUsersSchema>
export const CreateUserBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

export const ModifyUsersSchema = z.object({
    body: z.object({
        ids: z.array(z.number()).min(1),
    }),
});

export const CreateUserSchema = z.object({
  body: CreateUserBodySchema,
});

export const LoginBodySchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password must be at least 1 characters"),
});

export const LoginUserSchema = z.object({
  body:LoginBodySchema,
});


export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    role: z.string().optional(),
    status: z.string().optional(),
    created_at: z.string().optional(),
    last_login: z.string().nullable().optional(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
