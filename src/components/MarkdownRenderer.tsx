import type { MDXModule } from "@/lib/markdown/mdx-types";
import { createEffect, createResource, createSignal, type JSX, on, Suspense } from "solid-js";
import { components } from "./markdown-components";
import { renderMarkdown } from '@/lib/markdown';
import { createAsync } from "@solidjs/router";

export default function MarkdownRenderer(props: {
    markdown: string,
    onCompile?: () => void,
    onError?: (error: unknown) => void,
    disableComponents?: boolean
}) {
    const markdownModule = createAsync(async () => {
        let component: JSX.Element;

        try {
            component = await renderMarkdown(props.markdown).then(module => module.default({
                components: props.disableComponents ? {} : components
            }));
        } catch (err) {
            props.onError?.(err);
            return undefined;
        }

        props.onCompile?.();

        return component;
    });

    return <>
        {markdownModule() ?? <></>}
    </>;
}