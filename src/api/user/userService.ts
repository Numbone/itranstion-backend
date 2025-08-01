import { StatusCodes } from "http-status-codes";

import type { CreateUserBody, LoginBody, User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	async create(data: CreateUserBody): Promise<ServiceResponse<User | null>> {
		try {
			const createdUser = await this.userRepository.createAsync(data);
			return ServiceResponse.success<User>("User created", createdUser, StatusCodes.CREATED);
		} catch (error) {
			const message = `Error creating user: ${(error as Error).message}`;
			logger.error(message);
			return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async login(data: LoginBody): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.loginAsync(data);
			if (!user) {
				return ServiceResponse.failure("Invalid email or password", null, StatusCodes.UNAUTHORIZED);
			}
			return ServiceResponse.success<User>("User logged in", user, StatusCodes.OK);
		} catch (error) {
			const message = `Error logging in user: ${(error as Error).message}`;
			logger.error(message);
			return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async findAll(): Promise<ServiceResponse<User[] | null>> {
		try {
			const users = await this.userRepository.findAllAsync();
			if (!users || users.length === 0) {
				return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User[]>("Users found", users);
		} catch (ex) {
			const errorMessage = `Error finding all users: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving users.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
	
	async findById(id: number): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findByIdAsync(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async blockUsers(ids: number[]): Promise<ServiceResponse<null>> {
		try {
			await this.userRepository.updateStatusMany(ids, "blocked");
			return ServiceResponse.success("Users blocked", null, StatusCodes.OK);
		} catch (error) {
			const message = `Error blocking users: ${(error as Error).message}`;
			logger.error(message);
			return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async unblockUsers(ids: number[]): Promise<ServiceResponse<null>> {
		try {
			await this.userRepository.updateStatusMany(ids, "active");
			return ServiceResponse.success("Users unblocked", null, StatusCodes.OK);
		} catch (error) {
			const message = `Error unblocking users: ${(error as Error).message}`;
			logger.error(message);
			return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteUsers(ids: number[]): Promise<ServiceResponse<null>> {
		try {
			await this.userRepository.deleteMany(ids);
			return ServiceResponse.success("Users deleted", null, StatusCodes.OK);
		} catch (error) {
			const message = `Error deleting users: ${(error as Error).message}`;
			logger.error(message);
			return ServiceResponse.failure(message, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
