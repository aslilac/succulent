import { Schema, SchemaBase } from "../schema.js";
import { toDisplayKey } from "./toDisplayKey.js";
import { toDisplayString } from "./toDisplayString.js";

export function invalidProperty(key: unknown, schema: SchemaBase<unknown>) {
	const displayKey = toDisplayKey(key);
	const typeName = Schema.displayName(schema);

	return `Expected property ${displayKey} to have type ${typeName}`;
}

export function invalidValue(value: unknown, schema: SchemaBase<unknown>) {
	const displayValue = toDisplayString(value);
	const typeName = Schema.displayName(schema);

	return `Expected ${typeName}, got ${displayValue}`;
}
