import sequelize from "./src/db.js";
import app from "./src/app.js";
import "./src/models/index.js";

sequelize
	.sync({ force: false, logging: false })
	.then(() => {
		console.log("base de datos conectada! :D");
		app.listen(process.env.PORT || 3001, function () {
			console.log("App is listening on port 3001!");
		});
	})
	.catch((err) => console.error(err));
