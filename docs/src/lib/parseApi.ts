export interface ApiDoc {
	description: string;
	remarks?: string;
	examples: string[];
}

export type ApiDocs = Record<string, ApiDoc>;

// Strip the `/**` opener, the ` */` closer, and the leading ` * ` on each line.
function stripCommentMarkers(raw: string): string {
	return raw
		.replace(/^\s*\/\*\*\s*\n?/, "")
		.replace(/\n?\s*\*\/\s*$/, "")
		.split("\n")
		.map((line) => line.replace(/^\s*\*\s?/, ""))
		.join("\n")
		.trim();
}

// Pull contents out of fenced code blocks. Returns the text inside ```ts ... ```
// (or any other language). If a chunk has no fence, returns it verbatim.
function extractCodeBlocks(text: string): string[] {
	const blocks: string[] = [];
	const re = /```[a-z]*\n([\s\S]*?)```/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(text)) !== null) {
		blocks.push((m[1] ?? "").trimEnd());
	}
	if (blocks.length === 0 && text.trim()) blocks.push(text.trim());
	return blocks;
}

function parseComment(body: string): ApiDoc {
	const cleaned = stripCommentMarkers(body);

	// Split on @tag boundaries that start a line. Capture the tag name.
	const parts = cleaned.split(/\n(?=@\w)/);
	const first = parts[0]?.trim() ?? "";
	// A leading chunk starting with @ is itself a tag (no untagged description).
	const description = first.startsWith("@") ? "" : first;
	const tagged = first.startsWith("@") ? parts : parts.slice(1);

	let remarks: string | undefined;
	const examples: string[] = [];

	for (const part of tagged) {
		const tagMatch = part.match(/^@(\w+)\s*([\s\S]*)$/);
		if (!tagMatch) continue;
		const [, tag, rest] = tagMatch as [string, string, string];
		switch (tag) {
			case "example":
				examples.push(...extractCodeBlocks(rest));
				break;
			case "remarks":
				remarks = rest.trim();
				break;
			// internalRemarks, param, throws, returns are intentionally ignored for now.
		}
	}

	return { description, examples, ...(remarks ? { remarks } : {}) };
}

// Matches `/** ... */` immediately followed by `export <kind> <name>`.
// Captures the comment and the export name.
const EXPORT_RE =
	/\/\*\*([\s\S]*?)\*\/\s*export\s+(?:declare\s+)?(?:const|function|class|type|interface|namespace|enum|var|let)\s+(\$?[A-Za-z_][A-Za-z0-9_]*)/g;

export function parseApi(files: Record<string, string>): ApiDocs {
	const out: ApiDocs = {};
	for (const [path, text] of Object.entries(files)) {
		if (path.endsWith(".test.ts")) continue;
		EXPORT_RE.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = EXPORT_RE.exec(text)) !== null) {
			const [, comment, name] = m as [string, string, string];
			const parsed = parseComment(`/**${comment}*/`);
			if (parsed.description || parsed.examples.length || parsed.remarks) {
				out[name] = parsed;
			}
		}
	}
	return out;
}
