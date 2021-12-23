module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testPathIgnorePatterns: ["<rootDir>/target/"],
	moduleNameMapper: {
		"^succulent$": "<rootDir>/src/main.ts",
	},
};
