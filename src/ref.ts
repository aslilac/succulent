export interface ErrorRef {
	error: Error | null;
}

export function createErrorRef(): ErrorRef {
	return { error: null };
}
