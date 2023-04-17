import {
	guard,
	maxLength,
	matches,
	Type,
	$Array,
	$Date,
	$interface,
	$optional,
	$string,
} from "succulent";

// Use your schema definition to automatically generate TypeScript types.
// Either one of the following should work. The choice is mostly a matter of style.
export type User1 = Type<typeof $User>;
export interface User2 extends Type<typeof $User> {}

// Easily define a reuseable way to validate input from untrusted sources
// By convention, schemas are named after the type they represent, prefixed with `$`.
export const $User = $interface({
	id: $string.that(matches(/[A-Za-z0-9_-]{24}/)),
	name: $string.that(maxLength(50)),
	emailAddresses: $Array($string.that(matches(/[A-Za-z0-9_-]{1,}\@hey\.com/))),
	meta: $optional(
		$interface({
			lastSeen: $optional($Date),
		}),
	),
});

export default function (user: unknown) {
	// You can specify a compatible generic type to use instead of the generated type!
	// Mostly helpful for getting nicer editor hints
	guard<User1>(user, $User);
	guard<User2>(user, $User);

	// x now has type `User`
	// ...
}
