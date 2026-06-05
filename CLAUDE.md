## Where am I?

Succulent is a runtime type-checking library for TypeScript. The pitch is "just write TypeScript and get runtime validation for free" — every TypeScript type `T` has a corresponding schema named `$T` (e.g. `$string`, `$Date`, `$Array($T)`).

## Commands

This is a pnpm workspace (`.`, `docs/`, `tests/`). Use the package manager specified by `packageManager` in `package.json`.

Library (repo root):

- `pnpm build` — compile `src/` to `build/` via `tsc -b tsconfig.build.json`.
- `pnpm type-check` — type-check everything (build + tests via project references).
- `pnpm test` — run unit tests in `src/**/*.test.ts` with Vitest.
- `pnpm fmt` — Prettier write across the repo.

The "real" test suite (the one CI runs) lives in `tests/` and is its own package:

- `pnpm --filter @succulent/tests... test` (or `cd tests && pnpm test`) — compiles `tests/` with `tsc` and runs the resulting JS with `node`. Covers discrimination/inference/README examples and exercises the published API as a consumer would.
- `cd tests && pnpm bench` / `pnpm perf` — benchmarks vs. zod/yup/runtypes (optional deps); `perf` uses 0x for flamegraphs.

Docs site (`docs/`, Astro): `pnpm --filter @succulent/docs dev | build | preview`.

CI (`.github/workflows/check.yaml`) runs on Node 20/22/24 and executes: spellcheck (`crate-ci/typos`), `prettier --check .`, `pnpm type-check`, and `pnpm test` from `tests/`.

## Architecture

Everything is built on a single `Schema<T>` class (`src/schema.ts`). A schema is a wrapped `(x: unknown) => x is T` predicate plus a `displayName` and an optional iterator (used by `$enum` etc. to enumerate finite types). Schemas throw `TypeError` on mismatch rather than returning false — `check()` is `asserts x is T`, and `is()` is the boolean-returning variant that swallows the throw.

Composition is via `schema.that(...filters)` (refine with predicates) and combinator functions like `$Array`, `$interface`, `$Map`, `$optional`, `$or`, `$and`, `lazy` (for self-referential schemas).

Source layout under `src/`:

- `schema.ts` — the `Schema<T>` class, `Type<X>` / `Schema.Unwrap`, `LiteralSchema` (literals are auto-wrapped via `Schema.from`).
- `$.ts` — a namespace object that re-exports every `$Foo` as `$.Foo`, so callers can choose `import { $string }` or `import { $ }; $.string`.
- `types/` — concrete schemas: primitives (`string`, `number`, `bigint`, `symbol`, `boolean`), `object`/`interface`/`Exact`, `Array`/`Tuple`/`Record`/`Map`/`Set`, constants (`null`/`undefined`/`NaN`/`true`/`false`/`nullish`/`falsy`), built-ins (`Date`, `RegExp`, `URL`, typed arrays, `Blob`/`File`/`Buffer`, `Request`/`Response`, `Error`), and meta (`any`, `unknown`, `never`, `instanceof`, `tryinstanceof`, `enum`, `literal`, `optional`, `maybe`).
- `operators/` — `check`/`guard` (asserts), `is` (boolean), `lazy`, logic combinators, iteration helpers.
- `filters/` — `that()` predicates: `hasMinLength`/`hasMaxLength`, `matches`, `inRange`/`min`/`max`.
- `base/` — error-message builders, key-display, `KeyReporter` (the object/Exact walker that batches per-key errors), trace/indent helpers.

The public entry point (`src/index.ts`) flat-exports `filters`, `operators`, `types`, `schema`, plus the `$` namespace. `tsconfig.build.json` excludes `*.test.*` and any `_*` file from the published build — so anything in `src/_util.ts` or similar is internal.

## Conventions

- **Schema naming**: TypeScript type `Foo` → schema `$Foo`. Keep this convention rigid; tests and the README both lean on it.
- **Code style**: tabs, double quotes, trailing commas, `proseWrap: never` (see `.prettierrc.json`). `verbatimModuleSyntax` is on, so use `import type` / `export type` where appropriate. All intra-package imports use `.js` extensions (`node16` module resolution).
- **Tests**: co-located `*.test.ts` next to source uses Vitest globals (no need to import `describe`/`it`/`expect`). The `tests/` package is plain `node` running compiled JS — when adding integration-style tests there, write them as imperative scripts that throw on failure.
- **TypeScript**: `strict` + `noUnusedLocals`/`noUnusedParameters` are on. `// @ts-expect-error` is used deliberately in a few places (notably `$interface`/`$Exact`) where the generic indexing defeats the checker — leave them be unless you can actually fix the underlying type.
