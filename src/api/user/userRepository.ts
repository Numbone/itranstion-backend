import type { CreateUserBody, User } from "@/api/user/userModel";
import { pool } from "@/common/utils/db";
import bcrypt from "bcrypt";
export const users: User[] = [
	{
		id: 1,
		name: "Alice",
		email: "alice@example.com",
		created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		last_login: new Date().toISOString(),
		role: "admin",
		status: "active",

	},
	{
		id: 2,
		name: "Robert",
		email: "Robert@example.com",
		created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
		last_login: new Date().toISOString(),
		role: "admin",
		status: "active",
	},
];

export class UserRepository {
	async findAllAsync(): Promise<User[]> {
		return users;
	}

	async findByIdAsync(id: number): Promise<User | null> {
		return users.find((user) => user.id === id) || null;
	}

	async createAsync(data: CreateUserBody): Promise<User> {
		const passwordHash = await bcrypt.hash(data.password, 10);

		const result = await pool.query(
			`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
			[data.name, data.email, passwordHash],
		);
		console.log(result,"result");

		const user = result.rows[0];
		delete user.password_hash;
		return user;
	}
}
