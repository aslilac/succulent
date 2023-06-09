import { indent } from "./indent.js";

export function trace(message: string, error?: unknown) {
	if (error instanceof Error) {
		return `${message}\n${indent(error.message)}`;
	}

	return message;
}
