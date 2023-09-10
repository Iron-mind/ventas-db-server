import dotenv from "dotenv";

dotenv.config();
//console.log(process.env.DB_USER );

const config = {
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbName: process.env.DB_NAME,
	dbPort: process.env.DB_PORT || "5432",
	dev: process.env.NODE_ENV !== "production",
	port: process.env.API_PORT || "3001",
	host: process.env.API_host || "localhost",
	cors: process.env.CORS || "localhost:3000",
	dbUri:
		process.env.DB_URI ||
		`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

export default config;
