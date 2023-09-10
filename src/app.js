import express from "express";
import cookieParser from "cookie-parser";
// import morgan from "morgan"
import cors from "cors";
import routes from "./routes/index.js";
//-----------------------------------

const app = express();
app.use(express.urlencoded({ extended: true, limit: "50mb" })); //middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
// app.use(morgan('dev'));

app.use(
	cors({
		origin: "*",
		credentials: true,
		methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Accept",
			"token",
		],
	})
);

app.use((err, req, res, next) => {
	// eslint-disable-line no-unused-vars
	const status = err.status || 500;
	const message = err.message || err;
	console.error(err);
	res.status(status).send(message);
});

app.use("/api", routes);

export default app;
