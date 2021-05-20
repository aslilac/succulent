interface _Schema<T> {
	(...filters: readonly Filter<T>[]): (x: unknown) => x is T;
}

interface Filter<T> {
	(x: T): boolean;
}

const makeSchema =
	<T>(check: (x: unknown) => x is T): _Schema<T> =>
	(...filters: readonly Filter<T>[]) =>
		filters.length > 0
			? (x: unknown): x is T => check(x) && filters.every((filter) => filter(x))
			: check;
