import { evaluate } from '@mdx-js/mdx';
import * as jsxRuntime from 'solid-js/h/jsx-runtime';

import type { CompileOptions, EvaluateOptions } from "@mdx-js/mdx";
import remarkMdxDisableExplicitJsx from "./remark-mdx-disable-explicit-jsx";

const options = {
    remarkPlugins: [remarkMdxDisableExplicitJsx]
} satisfies Partial<EvaluateOptions> & CompileOptions;

export async function renderMarkdown(markdown: string) {
    const mdxModule = await evaluate(markdown, {
        ...jsxRuntime,
        ...options
    });

    console.log(mdxModule);

    return mdxModule;
}
