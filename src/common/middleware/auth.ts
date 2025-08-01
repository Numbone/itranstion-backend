import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../utils/envConfig";
import { pool } from "../utils/db";

interface JwtPayload {
  id: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const userId = decoded.id;

    const result = await pool.query("SELECT id, status FROM users WHERE id = $1", [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.status === "blocked") {
      return res.status(401).json({ message: "Unauthorized: User account is blocked" });
    }

    (req as any).user = { id: user.id, status: user.status };
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
