import { guard, $string } from "succulent";

/**
 * Takes untrusted user input!
 */
export default function (x: unknown): string {
	guard(x, $string);

	// x now has type `string` and can be treated as such
	return x;
}
