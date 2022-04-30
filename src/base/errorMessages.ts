import { Schema, SchemaBase } from "../schema";
import { toDisplayKey } from "./toDisplayKey";
import { toDisplayString } from "./toDisplayString";

export function incorrectProperty(key: unknown, schema: SchemaBase<unknown>) {
	const displayKey = toDisplayKey(key);
	const typeName = Schema.displayName(schema);

	return `Expected property ${displayKey} to have type ${typeName}`;
}

export function incorrectValue(value: unknown, schema: SchemaBase<unknown>) {
	const displayValue = toDisplayString(value);
	const typeName = Schema.displayName(schema);

	return `Expected ${typeName}, got ${displayValue}`;
}
