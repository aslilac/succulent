import { Type, $boolean, $Date, $interface, $string } from "succulent";

export const $Friend = $interface({
	// If your type includes a literal type like this, you can just use the literal!
	kind: "friend",
	name: $string,
	birthday: $Date,
	isCool: $boolean,
});

type Friend = Type<typeof $Friend>;

const billie: Friend = {
	kind: "friend",
	name: "Billie",
	birthday: new Date("2001-12-18"),
	isCool: true,
};

const jinx: Friend = {
	// @ts-expect-error - not `"friend"`
	kind: "enemy",
	name: "Jinx",
	birthday: new Date("2004-03-14"),
	isCool: true,
};
