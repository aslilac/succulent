# Succulent

Dead simple data validation, built for TypeScript.

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
	$undefined,
} from "succulent";

// Easily define a reuseable way to validate input from untrusted sources
const $user = $object({
	id: that($string, matches(/[A-Za-z0-9_-]{24}/)),
	name: that($string, hasMaxLength(50)),
	emailAddresses: $array(that($string, matches(/[A-Za-z0-9_-]{1,}\@hey\.com/))),
	meta: or(
		$undefined,
		$partialObject({
			lastSeen: $date,
		}),
	),
});

// Use your validation definition to automatically generate TypeScript types
import { Schema } from "succulent";
type User = Schema.Unwrap<typeof $user>;

export default function (user: unknown): string {
	if (!is(x, $user)) {
		throw new TypeError("Expected x to be a user");
		console.error($user.description);
	}

	return x; // is now type `User`
}
```

#### Even more complicated...

```typescript
import { is, reporter, that, inRange, $number, $object, $string } from "succulent";

type Friend = {
	name: string;
	happiness: number;
};

const $friend = $object({
	name: $string,
	happiness: that($number, inRange(0, 10)),
	friends: [$friend],
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
