const fs = require("fs");
const path = require("path");

function loadRoutes(app) {
	const routesDir = __dirname;
	fs.readdirSync(routesDir).forEach((file) => {
		if (file === "index.js") return;

		if (file.endsWith("-routes.js")) {
			const routeFilePath = path.join(routesDir, file);
			const router = require(routeFilePath);

			app.use("/", router);
		}
	});
}

module.exports = loadRoutes;
