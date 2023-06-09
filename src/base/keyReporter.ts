import { trace } from "./trace.js";

type Func<Args extends unknown[], R = void> = (...args: Args) => R;

export class KeyReporter<Args extends unknown[]> {
	constructor(
		private readonly check: Func<Args>,
		private readonly onError: Func<Args, string>,
	) {}

	private errorTraces: string[] = [];

	reset() {
		if (this.errorTraces.length > 0) {
			this.errorTraces = [];
		}
	}

	report(...args: Args) {
		try {
			this.check(...args);
		} catch (error) {
			this.errorTraces.push(trace(this.onError(...args), error));
		}
	}

	resolve() {
		if (this.errorTraces.length > 0) {
			throw new TypeError(this.errorTraces.join("\n"));
		}
	}
}
