module.exports = {
	apps: [
		{
			name: "app",
			script: "./server.js",
			instances: 3,
			exec_mode: "cluster",
			env: {
				NODE_ENV: "development",
				PORT: 3000,
			},
			env_production: {
				NODE_ENV: "production",
				PORT: 3000,
			},
		},
	],
};
