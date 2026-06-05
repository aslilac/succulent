// SUCCULENT — shared client behaviour
// theme · syntax highlighting · in-page links · copy buttons · command palette
//
// Imported via `<script>` in Layout.astro, so Astro bundles it as a deferred
// module. Other pages that need `symbols` / `highlight` import them directly
// from this module rather than reaching through a global.

export type SuccSymbolKind = "schema" | "operator" | "filter" | "type" | "page";

export interface SuccSymbol {
	name: string;
	kind: SuccSymbolKind;
	sig: string;
	blurb: string;
	group: string;
	href?: string;
}

export interface SuccApiDoc {
	description: string;
	remarks?: string;
	examples: string[];
}

// ---------- theme (persisted, applied pre-paint via inline head script) ----------
const toggleTheme = () => {
	const root = document.documentElement;
	const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
	root.setAttribute("data-theme", next);
	try {
		localStorage.setItem("succ-theme", next);
	} catch {}
};

document
	.querySelectorAll<HTMLButtonElement>(".theme-toggle")
	.forEach((btn) => btn.addEventListener("click", toggleTheme));

// ---------- TypeScript-ish syntax highlighter ----------
// The $schema names are highlighted in succulent-green — the signature touch.
const KEYWORDS = new Set([
	"import", "from", "export", "default", "const", "let", "var", "function",
	"return", "type", "interface", "extends", "implements", "new", "try",
	"catch", "throw", "typeof", "instanceof", "as", "in", "of", "if", "else",
	"for", "while", "do", "switch", "case", "break", "continue", "class",
	"public", "private", "protected", "readonly", "static", "async", "await",
	"yield", "void", "null", "undefined", "true", "false", "this", "super",
	"enum", "namespace", "keyof", "infer", "satisfies",
]);
const BUILTIN_TYPE = new Set([
	"string", "number", "boolean", "bigint", "symbol", "object",
	"unknown", "any", "never",
]);

const TOKEN_RE = new RegExp(
	[
		"(?<comment>\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",
		"(?<string>\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`(?:\\\\.|[^`\\\\])*`)",
		"(?<regexp>\\/(?:\\\\.|\\[(?:\\\\.|[^\\]\\n])*\\]|[^\\/\\n\\\\])+\\/[gimsuy]*)",
		"(?<schema>\\$[A-Za-z_][A-Za-z0-9_]*)",
		"(?<word>[A-Za-z_][A-Za-z0-9_]*)",
		"(?<num>\\b\\d[\\d_]*(?:\\.\\d+)?n?\\b)",
		"(?<punct>[{}()\\[\\];:,.<>=+\\-*/&|?!@%^~])",
	].join("|"),
	"g",
);

const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const classify = (
	groups: Record<string, string | undefined>,
	after: string,
): string | null => {
	if (groups["comment"] != null) return "comment";
	if (groups["string"] != null) return "string";
	if (groups["regexp"] != null) return "regexp";
	if (groups["schema"] != null) return "schema";
	if (groups["num"] != null) return "num";
	if (groups["punct"] != null) return "punct";
	const w = groups["word"];
	if (w != null) {
		if (KEYWORDS.has(w) || BUILTIN_TYPE.has(w)) return "keyword";
		if (after && after[0] === "(") return "fn";
		if (/^[A-Z]/.test(w)) return "type";
		return null;
	}
	return null;
};

export const highlight = (code: string): string => {
	let out = "";
	let last = 0;
	let m: RegExpExecArray | null;
	TOKEN_RE.lastIndex = 0;
	while ((m = TOKEN_RE.exec(code)) !== null) {
		const idx = m.index;
		out += esc(code.slice(last, idx));
		const after = code.slice(idx + m[0].length).replace(/^\s+/, "");
		const cls = classify(m.groups ?? {}, after);
		out += cls
			? `<span class="tok-${cls}">${esc(m[0])}</span>`
			: esc(m[0]);
		last = idx + m[0].length;
		if (m[0].length === 0) TOKEN_RE.lastIndex++;
	}
	out += esc(code.slice(last));
	return out;
};

export const highlightAll = (root: ParentNode = document) => {
	root
		.querySelectorAll<HTMLElement>(
			"code[data-lang], pre[data-lang] > code, .code pre > code, pre.bare > code",
		)
		.forEach((el) => {
			if (el.dataset["hl"]) return;
			el.innerHTML = highlight((el.textContent ?? "").replace(/\n$/, ""));
			el.dataset["hl"] = "1";
		});
};

// ---------- in-page fragment links ----------
// With <base href="…"> set, the browser would resolve href="#foo" against the
// base URL and navigate away from the current page. Intercept those clicks and
// scroll on the current page instead.
document.addEventListener("click", (e) => {
	const a = (e.target as Element | null)?.closest("a");
	if (!a) return;
	const href = a.getAttribute("href");
	if (!href || href[0] !== "#") return;
	e.preventDefault();
	const target = document.getElementById(href.slice(1));
	if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
	history.pushState(null, "", location.pathname + location.search + href);
});

// ---------- copy buttons ----------
document.addEventListener("click", (e) => {
	const btn = (e.target as Element | null)?.closest<HTMLElement>(".copy");
	if (!btn) return;
	const block = btn.closest(".code");
	const code = block?.querySelector("code");
	if (!code) return;
	navigator.clipboard?.writeText(code.textContent ?? "");
	btn.classList.add("copied");
	const label = btn.querySelector<HTMLElement>(".copy-label");
	const prev = label?.textContent ?? "";
	if (label) label.textContent = "copied";
	setTimeout(() => {
		btn.classList.remove("copied");
		if (label) label.textContent = prev;
	}, 1400);
});

// ============================================================
// API SYMBOL INDEX (shared by command palette + reference)
// ============================================================
export const symbols: SuccSymbol[] = [
	// ---- core operators ----
	{ name: "guard", kind: "operator", sig: "guard(x, $schema)", blurb: "Assert & narrow — throws on mismatch", group: "Operators" },
	{ name: "check", kind: "operator", sig: "check(x, $schema)", blurb: "Alias of guard — asserts x is T", group: "Operators" },
	{ name: "is", kind: "operator", sig: "is(x, $schema)", blurb: "Boolean type guard — never throws", group: "Operators" },
	{ name: "lazy", kind: "operator", sig: "lazy(() => $schema)", blurb: "Defer a schema — for recursive types", group: "Operators" },
	{ name: "union", kind: "operator", sig: "union(...$schemas)", blurb: "Matches any one of the schemas — T | U", group: "Operators" },
	{ name: "or", kind: "operator", sig: "or($x, $y)", blurb: "Two-arg union — X | Y", group: "Operators" },
	{ name: "and", kind: "operator", sig: "and($x, $y)", blurb: "Intersection — X & Y", group: "Operators" },
	{ name: "oneOf", kind: "operator", sig: "oneOf(iterable)", blurb: "Matches one of the given values", group: "Operators" },
	{ name: "CheckError", kind: "operator", sig: "CheckError", blurb: "Error thrown by guard/check on mismatch", group: "Operators" },

	// ---- filters (.that()) ----
	{ name: "matches", kind: "filter", sig: "matches(/regexp/)", blurb: "String matches a regular expression", group: "Filters" },
	{ name: "inRange", kind: "filter", sig: "inRange(min, max)", blurb: "Number is within [min, max]", group: "Filters" },
	{ name: "hasLength", kind: "filter", sig: "hasLength(n)", blurb: "Exact .length", group: "Filters" },
	{ name: "minLength", kind: "filter", sig: "minLength(n)", blurb: "At least n long", group: "Filters" },
	{ name: "maxLength", kind: "filter", sig: "maxLength(n)", blurb: "At most n long", group: "Filters" },
	{ name: "nonEmpty", kind: "filter", sig: "nonEmpty", blurb: ".length > 0", group: "Filters" },

	// ---- primitives ----
	{ name: "$string", kind: "schema", sig: "$string", blurb: "A primitive string", group: "Primitives" },
	{ name: "$number", kind: "schema", sig: "$number", blurb: "A primitive number (not NaN)", group: "Primitives" },
	{ name: "$int", kind: "schema", sig: "$int", blurb: "An integer", group: "Primitives" },
	{ name: "$finite", kind: "schema", sig: "$finite", blurb: "A finite number", group: "Primitives" },
	{ name: "$bigint", kind: "schema", sig: "$bigint", blurb: "A bigint", group: "Primitives" },
	{ name: "$boolean", kind: "schema", sig: "$boolean", blurb: "true or false", group: "Primitives" },
	{ name: "$symbol", kind: "schema", sig: "$symbol", blurb: "A symbol", group: "Primitives" },
	{ name: "$NaN", kind: "schema", sig: "$NaN", blurb: "The value NaN", group: "Primitives" },

	// ---- constants & special ----
	{ name: "$literal", kind: "schema", sig: "$literal(value)", blurb: "Equality with Object.is", group: "Special" },
	{ name: "$optional", kind: "schema", sig: "$optional($T)", blurb: "T | undefined", group: "Special" },
	{ name: "$maybe", kind: "schema", sig: "$maybe($T)", blurb: "T | null | undefined", group: "Special" },
	{ name: "$nullish", kind: "schema", sig: "$nullish", blurb: "null or undefined", group: "Special" },
	{ name: "$falsy", kind: "schema", sig: "$falsy", blurb: "Any falsy value", group: "Special" },
	{ name: "$any", kind: "schema", sig: "$any", blurb: "Matches anything", group: "Special" },
	{ name: "$unknown", kind: "schema", sig: "$unknown", blurb: "Matches anything; narrows to unknown", group: "Special" },
	{ name: "$never", kind: "schema", sig: "$never", blurb: "Matches nothing", group: "Special" },
	{ name: "$true", kind: "schema", sig: "$true", blurb: "Literal true", group: "Special" },
	{ name: "$false", kind: "schema", sig: "$false", blurb: "Literal false", group: "Special" },
	{ name: "$null", kind: "schema", sig: "$null", blurb: "Literal null", group: "Special" },
	{ name: "$undefined", kind: "schema", sig: "$undefined", blurb: "Literal undefined", group: "Special" },

	// ---- objects & collections ----
	{ name: "$interface", kind: "schema", sig: "$interface({ ... })", blurb: "An object with the given shape", group: "Objects & collections" },
	{ name: "$Exact", kind: "schema", sig: "$Exact({ ... })", blurb: "Shape with no extra properties", group: "Objects & collections" },
	{ name: "$object", kind: "schema", sig: "$object", blurb: "Any non-null object", group: "Objects & collections" },
	{ name: "$Array", kind: "schema", sig: "$Array($T)", blurb: "An array of T", group: "Objects & collections" },
	{ name: "$Tuple", kind: "schema", sig: "$Tuple($A, $B)", blurb: "A fixed-length tuple", group: "Objects & collections" },
	{ name: "$Record", kind: "schema", sig: "$Record($K, $V)", blurb: "Record<K, V>", group: "Objects & collections" },
	{ name: "$Map", kind: "schema", sig: "$Map($K, $V)", blurb: "A Map<K, V>", group: "Objects & collections" },
	{ name: "$Set", kind: "schema", sig: "$Set($T)", blurb: "A Set<T>", group: "Objects & collections" },
	{ name: "$enum", kind: "schema", sig: "$enum(MyEnum)", blurb: "A TypeScript enum value", group: "Objects & collections" },

	// ---- built-in instances ----
	{ name: "$Date", kind: "schema", sig: "$Date", blurb: "A Date instance", group: "Built-ins" },
	{ name: "$RegExp", kind: "schema", sig: "$RegExp", blurb: "A RegExp instance", group: "Built-ins" },
	{ name: "$Error", kind: "schema", sig: "$Error", blurb: "An Error instance", group: "Built-ins" },
	{ name: "$URL", kind: "schema", sig: "$URL", blurb: "A URL instance", group: "Built-ins" },
	{ name: "$Blob", kind: "schema", sig: "$Blob", blurb: "A Blob (when available)", group: "Built-ins" },
	{ name: "$File", kind: "schema", sig: "$File", blurb: "A File (when available)", group: "Built-ins" },
	{ name: "$Buffer", kind: "schema", sig: "$Buffer", blurb: "A Node Buffer (when available)", group: "Built-ins" },
	{ name: "$Request", kind: "schema", sig: "$Request", blurb: "A fetch Request (when available)", group: "Built-ins" },
	{ name: "$Response", kind: "schema", sig: "$Response", blurb: "A fetch Response (when available)", group: "Built-ins" },
	{ name: "$ArrayBuffer", kind: "schema", sig: "$ArrayBuffer", blurb: "An actual ArrayBuffer (not a view)", group: "Built-ins" },
	{ name: "$ArrayBufferView", kind: "schema", sig: "$ArrayBufferView", blurb: "Any view backed by an ArrayBuffer", group: "Built-ins" },
	{ name: "$instanceof", kind: "schema", sig: "$instanceof(Ctor)", blurb: "An instance of any class", group: "Built-ins" },
	{ name: "$tryinstanceof", kind: "schema", sig: "$tryinstanceof(() => Ctor)", blurb: "Like $instanceof, but tolerates missing globals", group: "Built-ins" },

	// ---- typed arrays ----
	{ name: "$Int8Array", kind: "schema", sig: "$Int8Array", blurb: "An Int8Array", group: "Typed arrays" },
	{ name: "$Int16Array", kind: "schema", sig: "$Int16Array", blurb: "An Int16Array", group: "Typed arrays" },
	{ name: "$Int32Array", kind: "schema", sig: "$Int32Array", blurb: "An Int32Array", group: "Typed arrays" },
	{ name: "$BigInt64Array", kind: "schema", sig: "$BigInt64Array", blurb: "A BigInt64Array", group: "Typed arrays" },
	{ name: "$Uint8Array", kind: "schema", sig: "$Uint8Array", blurb: "A Uint8Array", group: "Typed arrays" },
	{ name: "$Uint8ClampedArray", kind: "schema", sig: "$Uint8ClampedArray", blurb: "A Uint8ClampedArray", group: "Typed arrays" },
	{ name: "$Uint16Array", kind: "schema", sig: "$Uint16Array", blurb: "A Uint16Array", group: "Typed arrays" },
	{ name: "$Uint32Array", kind: "schema", sig: "$Uint32Array", blurb: "A Uint32Array", group: "Typed arrays" },
	{ name: "$BigUint64Array", kind: "schema", sig: "$BigUint64Array", blurb: "A BigUint64Array", group: "Typed arrays" },
	{ name: "$Float32Array", kind: "schema", sig: "$Float32Array", blurb: "A Float32Array", group: "Typed arrays" },
	{ name: "$Float64Array", kind: "schema", sig: "$Float64Array", blurb: "A Float64Array", group: "Typed arrays" },

	// ---- type helpers ----
	{ name: "Type", kind: "type", sig: "Type<typeof $X>", blurb: "Infer the TS type from a schema", group: "Type helpers" },
	{ name: "Schema", kind: "type", sig: "Schema<T>", blurb: "The schema type, for annotations", group: "Type helpers" },

	// ---- pages ----
	// Hrefs are relative; <base> in the layout resolves them to the deploy path.
	{ name: "Getting started", kind: "page", sig: "", blurb: "Install & first guard", group: "Pages", href: "getting-started" },
	{ name: "API reference", kind: "page", sig: "", blurb: "Every symbol", group: "Pages", href: "api" },
	{ name: "Migrate from zod", kind: "page", sig: "", blurb: "Mapping table & gotchas", group: "Pages", href: "migrate-from-zod" },
	{ name: "Migrate from yup", kind: "page", sig: "", blurb: "Mapping table & gotchas", group: "Pages", href: "migrate-from-yup" },
	{ name: "Home", kind: "page", sig: "", blurb: "Overview", group: "Pages", href: "." },
];

// ============================================================
// COMMAND PALETTE
// ============================================================
{
	const KIND_LABEL: Record<SuccSymbolKind, string> = {
		schema: "schema",
		operator: "operator",
		filter: "filter",
		type: "type",
		page: "page",
	};

	let overlay: HTMLElement | null = null;
	let input: HTMLInputElement | null = null;
	let results: HTMLElement | null = null;
	let items: SuccSymbol[] = [];
	let sel = 0;

	const build = () => {
		overlay = document.createElement("div");
		overlay.className = "cmdk-overlay";
		overlay.innerHTML =
			'<div class="cmdk" role="dialog" aria-modal="true">' +
			'<div class="cmdk-input-row">' +
			'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
			'<input class="cmdk-input" placeholder="Search schemas, operators, filters…" aria-label="Search documentation" />' +
			"</div>" +
			'<div class="cmdk-results"></div>' +
			'<div class="cmdk-foot">' +
			'<span class="hint"><span class="kbd">↑</span><span class="kbd">↓</span> navigate</span>' +
			'<span class="hint"><span class="kbd">↵</span> open</span>' +
			'<span class="hint"><span class="kbd">esc</span> close</span>' +
			'<span style="margin-left:auto" class="hint">succulent docs</span>' +
			"</div>" +
			"</div>";
		document.body.appendChild(overlay);
		input = overlay.querySelector(".cmdk-input")!;
		results = overlay.querySelector(".cmdk-results")!;

		overlay.addEventListener("click", (e) => {
			if (e.target === overlay) close();
		});
		input.addEventListener("input", () => render(input!.value));
		input.addEventListener("keydown", onKey);
	};

	const score = (sym: SuccSymbol, q: string): number => {
		const n = sym.name.toLowerCase();
		const b = (sym.blurb || "").toLowerCase();
		if (n === q) return 100;
		if (n.indexOf(q) === 0 || n.indexOf("$" + q) === 0) return 80;
		if (n.indexOf(q) !== -1) return 60;
		if (b.indexOf(q) !== -1) return 30;
		return 0;
	};

	const render = (q: string) => {
		q = (q || "").trim().toLowerCase();
		let list = symbols.slice();
		if (q) {
			list = list
				.map((s) => ({ s, sc: score(s, q) }))
				.filter((x) => x.sc > 0)
				.sort((a, b) => b.sc - a.sc)
				.map((x) => x.s);
		}
		items = list;
		sel = 0;
		if (!list.length) {
			results!.innerHTML =
				'<div class="cmdk-empty">No matches for “' + q + "”</div>";
			return;
		}

		let html = "";
		let lastGroup: string | null = null;
		list.forEach((s, i) => {
			if (s.group !== lastGroup) {
				html += '<div class="cmdk-group-label">' + s.group + "</div>";
				lastGroup = s.group;
			}
			html +=
				'<button class="cmdk-item" data-i="' + i + '">' +
				'<span class="kind-dot kind-' + s.kind + '"></span>' +
				'<span class="name">' + (s.sig || s.name) + "</span>" +
				'<span class="blurb">' + (s.blurb || KIND_LABEL[s.kind] || "") + "</span>" +
				"</button>";
		});
		results!.innerHTML = html;
		results!.querySelectorAll<HTMLElement>(".cmdk-item").forEach((el) => {
			el.addEventListener("click", () => go(items[+el.dataset["i"]!]));
			el.addEventListener("mousemove", () => setSel(+el.dataset["i"]!));
		});
		highlightSel();
	};

	const setSel = (i: number) => {
		sel = i;
		highlightSel();
	};

	const highlightSel = () => {
		const els = results!.querySelectorAll<HTMLElement>(".cmdk-item");
		els.forEach((el) => {
			el.classList.toggle("sel", +el.dataset["i"]! === sel);
		});
		const cur = results!.querySelector<HTMLElement>(".cmdk-item.sel");
		if (cur) {
			const r = cur.getBoundingClientRect();
			const pr = results!.getBoundingClientRect();
			if (r.bottom > pr.bottom) results!.scrollTop += r.bottom - pr.bottom + 8;
			if (r.top < pr.top) results!.scrollTop -= pr.top - r.top + 8;
		}
	};

	const onKey = (e: KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			sel = Math.min(sel + 1, items.length - 1);
			highlightSel();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			sel = Math.max(sel - 1, 0);
			highlightSel();
		} else if (e.key === "Enter") {
			e.preventDefault();
			if (items[sel]) go(items[sel]);
		} else if (e.key === "Escape") {
			close();
		}
	};

	const go = (sym: SuccSymbol | undefined) => {
		if (!sym) return;
		if (sym.href) {
			// Relative URLs are resolved against the document's base URL (<base>).
			window.location.href = sym.href;
			return;
		}
		close();
		const target = document.getElementById("api-" + sym.name);
		if (target) {
			window.scrollTo({
				top: target.getBoundingClientRect().top + window.scrollY - 90,
				behavior: "smooth",
			});
			target.classList.add("flash");
			setTimeout(() => target.classList.remove("flash"), 1200);
		} else {
			window.location.href = "api#api-" + encodeURIComponent(sym.name);
		}
	};

	const open = () => {
		if (!overlay) build();
		overlay!.classList.add("open");
		render("");
		setTimeout(() => input!.focus(), 30);
	};
	const close = () => {
		if (overlay) {
			overlay.classList.remove("open");
			input!.value = "";
		}
	};

	document.addEventListener("keydown", (e) => {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			open();
		}
		if (
			e.key === "/" &&
			!/INPUT|TEXTAREA/.test(document.activeElement?.tagName ?? "")
		) {
			e.preventDefault();
			open();
		}
	});
	document.addEventListener("click", (e) => {
		if ((e.target as Element | null)?.closest("[data-cmdk]")) {
			e.preventDefault();
			open();
		}
	});
}

// Module is loaded as deferred, so the DOM is fully parsed by the time this
// runs — no DOMContentLoaded wrapper needed.
highlightAll();
