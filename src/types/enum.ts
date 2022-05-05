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

function isEnumMember<E, K extends string | number | symbol>(
	x: unknown,
	enumObject: Record<K, E>,
): x is E {
	switch (typeof x) {
		case "number":
			// @ts-expect-error - This is some real fun voodoo :)
			return enumObject[enumObject[x as K]] === x;
		case "string":
			return (
				typeof enumObject[x as K] !== "number" &&
				Object.values(enumObject).includes(x)
			);
		default:
			return false;
	}
}

export function $enum<E, K extends string | number | symbol>(
	enumObject: Record<K, E>,
): Schema<E> {
	return new Schema((x: unknown): x is E => isEnumMember(x, enumObject), {
		displayName: `enum { ${enumKeys(enumObject).join(", ")} }`,
	});
}
