import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";
import { pool } from "./common/utils/db";
import fs from "fs";
import path from "path";

const runMigrations = async () => {
	try {
		const sql = fs.readFileSync(path.resolve(__dirname, "db/init.sql"), "utf8");
		await pool.query(sql);
		logger.info("Таблицы созданы / обновлены");
	} catch (error) {
		logger.error("Ошибка при выполнении миграции", error);
		process.exit(1);
	}
};

const server = app.listen(env.PORT, async() => {
	await pool.connect();
	await runMigrations();
	const { NODE_ENV, HOST, PORT } = env;
	logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
	logger.info("sigint received, shutting down");
	server.close(() => {
		logger.info("server closed");
		process.exit();
	});
	setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
