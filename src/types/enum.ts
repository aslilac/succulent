import { Schema } from "../schema";

function isEnumMemberName<E, K extends string | number | symbol>(
	x: unknown,
	enumObject: Record<K, E>,
): x is E {
	// @ts-expect-error - This is some real fun voodoo :)
	// eslint-disable-next-line
	return x in enumObject && typeof enumObject[enumObject[x]] !== "number";
}

function enumKeys<E, K extends string | number | symbol>(enumObject: Record<K, E>): K[] {
	return Object.keys(enumObject).filter((key) =>
		isEnumMemberName(key, enumObject),
	) as K[];
}

export interface EnumOptions {
	displayName?: string;
}

export function $enum<E, K extends string | number | symbol>(
	enumObject: Record<K, E>,
	options: EnumOptions = {},
): Schema<E> {
	const keys = enumKeys(enumObject);
	const values = new Set(keys.map((key) => enumObject[key]));

	// eslint-disable-next-line
	return new Schema((x: unknown): x is E => values.has(x as any), {
		displayName: options.displayName ?? `enum { ${keys.join(", ")} }`,
		*iter() {
			yield* values;
		},
	});
}
