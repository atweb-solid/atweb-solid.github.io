import type { evaluate } from "@mdx-js/mdx";

export type MDXModule = Awaited<ReturnType<typeof evaluate>>;
