/**
 * @deprecated Use `guard` and catch the error if necessary
 */
export interface ErrorRef {
	error: Error | null;
}

/**
 * @deprecated Use `guard` and catch the error if necessary
 */
export function createErrorRef(): ErrorRef {
	return { error: null };
}
