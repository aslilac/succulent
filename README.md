# Succulent

Powerful and easy runtime type checking

### Examples

```typescript
import { is, $string } from "succulent";

/**
 * Takes untrusted user input!
 */
export default function (x: unknown): string {
	if (!is(x, $string)) {
		throw new TypeError("Expected x to be a string");
	}

	// x now has type `string` and can be treated as such
	return x;
}
```

#### More complicated...

```typescript
import {
	hasMaxLength,
	is,
	matches,
	Type,
	$array,
	$Date,
	$object,
	$optional,
	$string,
} from "succulent";

// Use your schema definition to automatically generate TypeScript types.
// Either one of the following should work. The choice is mostly a matter of style.
export type User = Type<typeof $User>;
export interface User extends Type<typeof $User> {}

// Easily define a reuseable way to validate input from untrusted sources
export const $User = $object({
	id: $string.that(matches(/[A-Za-z0-9_-]{24}/)),
	name: $string.that(hasMaxLength(50)),
	emailAddresses: $array($string.that(matches(/[A-Za-z0-9_-]{1,}\@hey\.com/))),
	meta: $optional(
		$object({
			lastSeen: $optional($Date),
		}),
	),
});

export default function (user: unknown) {
	// You can specify a compatible generic type to use instead of the generated type!
	// Mostly helpful for getting nicer editor hints
	if (!is<User>(x, $User)) {
		throw new TypeError("Expected x to be a User");
	}

	// x now has type `User`
}
```

#### Even more complicated...

```typescript
import { createErrorRef, is, inRange, $int, $object, $string } from "succulent";

type Friend = {
	name: string;
	happiness: number;
};

const $Friend = $object({
	name: $string,
	happiness: $int.that(inRange(0, 10)),
	friends: [$Friend],
});

export default function (person: unknown) {
	// Allows us to report specific validation errors
	const ref = createErrorRef();

	// Specifying `Friend` here as a generic ensures that our $Friend schema is
	// compatible with the `Friend` type. If they get out of sync, TypeScript will throw
	// a compilation error to let you know.
	if (!is<Friend>(person, $Friend, ref)) {
		// As a note, you should just use `check` instead if this is all you plan on
		// doing. It would behave the same way that this example does, without needing
		// to create an `ErrorRef` object. But, if you need to access the `Error` object,
		// you can. :)
		throw ref.error;
	}

	return person; // person has type `Friend`
}
```
