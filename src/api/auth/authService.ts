import { StatusCodes } from "http-status-codes";

import type { CreateUserBody, LoginBody, User } from "@/api/user/userModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { AuthRepository } from "./authRepository";
import { generateToken } from "@/common/middleware/jwt";

export class AuthService {
    private authRepository: AuthRepository;

    constructor(repository: AuthRepository = new AuthRepository()) {
        this.authRepository = repository;
    }

    async create(data: CreateUserBody): Promise<ServiceResponse<User | null>> {
        try {
            const createdUser = await this.authRepository.createAsync(data);
            return ServiceResponse.success<User>("User created", createdUser, StatusCodes.CREATED);
        } catch (error) {
            const message = `Error creating user: ${(error as Error).message}`;
            logger.error(message);
            return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async login(data: LoginBody): Promise<ServiceResponse<{ user: User; accessToken: string } | null>> {
        try {
            const user = await this.authRepository.loginAsync(data);
            if (!user) {
                return ServiceResponse.failure("Invalid email or password", null, StatusCodes.UNAUTHORIZED);
            }
            const accessToken = generateToken({ id: user.id, role: user.role });

            return ServiceResponse.success<{ user: User; accessToken: string }>(
                "User logged in",
                { user, accessToken },
                200
            );
        } catch (error) {
            const message = `Error logging in user: ${(error as Error).message}`;
            logger.error(message);
            return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const authService = new AuthService();
