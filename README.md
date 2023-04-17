# Succulent

Powerful and easy runtime type checking

### Motivation

> What if you could just write TypeScript, and get runtime validation for free?

Basically, a lot of equivalent libraries have weird naming and syntax. We already know
TypeScript, and that knowledge already does so much for us, but to take the concept a
little bit further, and extend our type checking to the runtime, it kind of feels like
having to learn another dialect, with all of its subtle differences. Succulent's main goal
is to make it feel like you're just writing TypeScript, and for the necessary differences
to feel obvious quickly.

Some examples...

-   the type `string` is represented by the schema `$string`
-   the type `bigint` is represented by the schema `$bigint`
-   the type `Date` is represented by the schema `$Date`
-   the type `ArrayBuffer` is represented by the schema `$ArrayBuffer`

Getting more complex...

-   the type `T[]` (or equivalently, `Array<T>`) could be represented by the schema `$Array($T)` _(assuming `$T` is a schema)_
-   the type `Map<K, V>` could be represented by the schema `$Map($K, $V)` _(assuming `$K` and `$V` are schemas)_
-   the types `$any` and `$never` can be represented by the schemas `$any` and `$never` respectively

### Examples

```typescript
import { guard, $string } from "succulent";

/**
 * Takes untrusted user input!
 */
export default function (x: unknown): string {
	guard(x, $string);

	// x now has type `string` and can be treated as such
	return x;
}
```

#### More complicated...

```typescript
import {
	guard,
	hasMaxLength,
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
export type User = Type<typeof $User>;
export interface User extends Type<typeof $User> {}

// Easily define a reuseable way to validate input from untrusted sources
// By convention, schemas are named after the type they represent, prefixed with `$`.
export const $User = $interface({
	id: $string.that(matches(/[A-Za-z0-9_-]{24}/)),
	name: $string.that(hasMaxLength(50)),
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
	guard<User>(x, $User);

	// x now has type `User`
	// ...
}
```

#### Even more complicated...

```typescript
import {
	guard,
	inRange,
	lazy,
	Schema,
	$Array,
	$int,
	$interface,
	$string,
} from "succulent";

type Friend = {
	name: string;
	happiness: number;
	friends: Friend[];
};

// Specifying `Friend` here as a generic ensures that our $Friend schema is
// compatible with the `Friend` type. If they get out of sync, TypeScript will throw
// a compilation error to let you know.
const $Friend: Schema<Friend> = $interface({
	name: $string,
	happiness: $int.that(inRange(0, 10)),
	// We need to use `lazy` here because $Friend is not yet defined. A little unfortunate,
	// but there isn't really a be better way to do this. (unless you know of one, then tell me!)
	friends: $Array(lazy(() => $Friend)),
});

export default function (person: unknown) {
	try {
		guard(person, $Friend);

		// person has type `Friend` now!
		// ...
	} catch (error) {
		// Do something with the error, like probe the heirarchy of where errors came from!
	}
}
```
