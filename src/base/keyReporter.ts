import { trace } from "./trace";

type Func<Args extends unknown[], R = void> = (...args: Args) => R;
type ReportFunc<Args extends unknown[]> = Func<Args>;
type ResolveFunc = () => boolean;

export function keyReporter<Args extends unknown[], Key>(
	check: Func<Args>,
	onError: Func<Args, string>,
): [report: ReportFunc<Args>, resolve: ResolveFunc] {
	const errorTraces: string[] = [];

	const report: ReportFunc<Args> = (...args) => {
		try {
			check(...args);
		} catch (error) {
			errorTraces.push(trace(onError(...args), error));
		}
	};

	const resolve: ResolveFunc = () => {
		if (errorTraces.length > 0) {
			throw new TypeError(errorTraces.join("\n"));
		}

		return true;
	};

	return [report, resolve];
}
