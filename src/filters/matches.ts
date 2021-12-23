export function matches(expression: RegExp) {
	return function (t: string) {
		return expression.test(t);
	};
}
