export function indent(str: string, level: string | number = 2) {
	const indentation = typeof level === "number" ? " ".repeat(level) : level;

	return str
		.split("\n")
		.map((line) => `${indentation}${line}`)
		.join("\n");
}
