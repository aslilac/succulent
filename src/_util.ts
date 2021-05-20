type IsAny<T> = unknown extends T ? (T extends {} ? T : never) : never;
type NotAny<T> = T extends IsAny<T> ? never : T;

export function assertType<T, X extends T>(x: NotAny<X>) {}

/**
 * This should always be an error (hence the ts-expect-error), and
 * is put here to make sure this is always true whenever assertType
 * is imported. Because assertType is a noop, the type error isn't
 * actually dangerous.
 */
// @ts-expect-error
assertType<unknown, any>({} as any);
