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
	is,
	or,
	that,
	matches,
	hasMaxLength,
	$array,
	$date,
	$object,
	$string,
} from "succulent";

// Easily define a reuseable way to validate input from untrusted sources
const $User = $object({
	id: that($string, matches(/[A-Za-z0-9_-]{24}/)),
	name: that($string, hasMaxLength(50)),
	emailAddresses: $array(that($string, matches(/[A-Za-z0-9_-]{1,}\@hey\.com/))),
	meta: $optional(
		$object({
			lastSeen: $optional($date),
		}),
	),
});

// Use your validation definition to automatically generate TypeScript types
import { Type } from "succulent";
type User = Type<typeof $User>;

export default function (user: unknown): string {
	if (!is(x, $User)) {
		throw new TypeError("Expected x to be a user");
	}

	return x; // is now type `User`
}
```

#### Even more complicated...

```typescript
import { is, reporter, that, inRange, $int, $object, $string } from "succulent";

type Friend = {
	name: string;
	happiness: number;
};

const $Friend = $object({
	name: $string,
	happiness: that($int, inRange(0, 10)),
	friends: [$Friend],
});

export default function (person: unknown) {
	// Allows us to report specific validation errors
	const report = reporter();
	// Specifying `Friend` here as a generic ensures that our friend validator
	// is compatible with the `Friend` type
	if (!is<Friend>(person, $friend, report)) {
		// throw a detailed validation error message
		throw report.typeError;
	}

	return person; // person has type `Friend`
}
```
