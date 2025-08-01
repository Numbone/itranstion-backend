import type { CreateUserBody, LoginBody, User } from "@/api/user/userModel";
import { pool } from "@/common/utils/db";
import bcrypt from "bcrypt";


export class AuthRepository {
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

   

}
