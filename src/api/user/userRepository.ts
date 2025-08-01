import type { CreateUserBody, LoginBody, User } from "@/api/user/userModel";
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
		const result = await pool.query(`
		SELECT * FROM users
		ORDER BY last_login ASC
	`);
		for (const user of result.rows) {
			delete user.password_hash;
		}
		return result.rows;
	}

	async findByIdAsync(id: number): Promise<User | null> {
		const result = await pool.query(
			`SELECT * FROM users WHERE id = $1`,
			[id]
		);
		delete result.rows[0].password_hash
		return result.rows[0] || null;
	}

	async createAsync(data: CreateUserBody): Promise<User> {
		const passwordHash = await bcrypt.hash(data.password, 10);

		const result = await pool.query(
			`INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
			[data.name, data.email, passwordHash],
		);
		console.log(result, "result");

		const user = result.rows[0];
		delete user.password_hash;
		return user;
	}

	async loginAsync(data: LoginBody): Promise<User | null> {
		const { email, password } = data

		const result = await pool.query(
			`SELECT * FROM users WHERE email=$1`,
			[email],

		);
		const user = result.rows[0];
		if (!user) {
			return null;
		}
		const isValidPassword = await bcrypt.compare(password, user.password_hash);
		if (!isValidPassword) {
			return null;
		}
		await pool.query(
			`UPDATE users SET last_login = NOW() WHERE id = $1`,
			[user.id],
		)
		delete result.rows[0].password_hash
		return user;
	}

	async updateStatusMany(ids: number[], status: "active" | "blocked"): Promise<void> {
		if (!ids.length) return;

		const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
		const query = `
		UPDATE users
		SET status = $${ids.length + 1}
		WHERE id IN (${placeholders})
	`;

		await pool.query(query, [...ids, status]);
	}

	async deleteMany(ids: number[]): Promise<void> {
		await pool.query(
			`DELETE FROM users WHERE id = ANY($1)`,
			[ids],
		);
	}

}
