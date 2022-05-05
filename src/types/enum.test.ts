/// <reference types="jest" />
import { assertType } from "../_util";
import { check, is, $enum } from "../index";
import { $object } from "./object";

enum Fruit {
	Apple,
	Banana,
	Mango,
	Peach,
	Strawberry,
}

enum FunnyNumber {
	SixtyNine = 69,
	FourTwenty = 420,
}

enum Friend {
	August = "August",
	Bandit = "Bandit",
	Dot = "Dot",
	Mady = "Mady",
	Toby = "Toby",
}

enum Message {
	Hello = "Hello, friend! How are you doing?",
	Bye = "Goodbye, friend! I'll see you later!",
}

test("$enum", () => {
	const $Fruit = $enum(Fruit);
	expect(is(Fruit.Apple, $Fruit)).toBe(true);
	expect(is(0, $Fruit)).toBe(true);
	expect(is("Apple", $Fruit)).toBe(false); // because `"Apple" !== Fruit.Apple`
	expect(is(5, $Fruit)).toBe(false); // because the enum ends at Strawberry = 4
	expect($Fruit.displayName).toBe("enum { Apple, Banana, Mango, Peach, Strawberry }");

	const $FunnyNumber = $enum(FunnyNumber);
	expect(is(FunnyNumber.SixtyNine, $FunnyNumber)).toBe(true);
	expect(is(420, $FunnyNumber)).toBe(true);
	expect(is("FourTwenty", $FunnyNumber)).toBe(false); // because `"FourTwenty" !== FunnyNumber.FourTwenty`
	expect(is(421, $FunnyNumber)).toBe(false);
	expect($FunnyNumber.displayName).toBe("enum { SixtyNine, FourTwenty }");

	const $Friend = $enum(Friend);
	expect(is(Friend.August, $Friend)).toBe(true);
	expect(is("Bandit", $Friend)).toBe(true); // because `"Bandit" === Friend.Bandit`
	expect($Friend.displayName).toBe("enum { August, Bandit, Dot, Mady, Toby }");

	const $Message = $enum(Message, { displayName: "Message" });
	expect(is(Message.Hello, $Message)).toBe(true);
	expect(is("Bye", $Message)).toBe(false); // because `"Bye" === Message.Bye`

	const $MessageToFriend = $object({
		friend: $Friend,
		message: $Message,
	});

	const good = { friend: Friend.Bandit, message: Message.Hello };
	const bad = { friend: "Tony", message: null };
	expect(is(good, $MessageToFriend)).toBe(true);
	expect(() => check(bad, $MessageToFriend)).toThrowErrorMatchingSnapshot();

	function _(x: unknown) {
		if (is(x, $Fruit)) assertType<Fruit, typeof x>(x);
		if (is(x, $FunnyNumber)) assertType<FunnyNumber, typeof x>(x);
		if (is(x, $Friend)) assertType<Friend, typeof x>(x);
		if (is(x, $Message)) assertType<Message, typeof x>(x);
	}
});
