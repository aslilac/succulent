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
	$date,
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
			lastSeen: $optional($date),
		}),
	),
});

export default function (user: unknown) {
	// You can specify a compatible generic type to use instead of the generated type
	// Mostly helpful for getting nicer editor hints
	if (!is<User>(x, $User)) {
		throw new TypeError("Expected x to be a User");
	}

	// x now has type `User`
}
```

#### Even more complicated...

```typescript
import { is, reporter, inRange, $int, $object, $string } from "succulent";

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
	const report = reporter();
	// Specifying `Friend` here as a generic ensures that our $Friend schema
	// is compatible with the `Friend` type
	if (!is<Friend>(person, $Friend, report)) {
		// throw a detailed validation error message
		throw report.typeError;
	}

	return person; // person has type `Friend`
}
```
