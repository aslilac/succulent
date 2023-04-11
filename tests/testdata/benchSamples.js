export const missingShallow = {
	number: 4,
	negNumber: -4,
	maxNumber: Number.MAX_SAFE_INTEGER,
	string: "foo",
	long: "foo".repeat(100),
	deeplyNested: {
		hello: "sailor",
		count: 10,
		bool: false,
	},
};

export const missingDeep = {
	number: 4,
	negNumber: -4,
	maxNumber: Number.MAX_SAFE_INTEGER,
	string: "foo",
	long: "foo".repeat(100),
	bool: true,
	deeplyNested: {
		hello: "sailor",
		count: 10,
	},
};

export const valid = {
	number: 4,
	negNumber: -4,
	maxNumber: Number.MAX_SAFE_INTEGER,
	string: "foo",
	long: "foo".repeat(100),
	bool: true,
	deeplyNested: {
		hello: "sailor",
		count: 10,
		bool: false,
	},
};

export const extraShallow = {
	number: 4,
	negNumber: -4,
	maxNumber: Number.MAX_SAFE_INTEGER,
	string: "foo",
	long: "foo".repeat(100),
	bool: true,
	friend: "Toby",
	deeplyNested: {
		hello: "sailor",
		count: 10,
		bool: false,
	},
};

export const extraDeep = {
	number: 4,
	negNumber: -4,
	maxNumber: Number.MAX_SAFE_INTEGER,
	string: "foo",
	long: "foo".repeat(100),
	bool: true,
	deeplyNested: {
		hello: "sailor",
		count: 10,
		bool: false,
		friend: "Toby",
	},
};
