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

		// person has type `Friend`
		// ...
	} catch (error) {
		// Do something with the error, like probe the heirarchy of where errors came from!
	}
}
