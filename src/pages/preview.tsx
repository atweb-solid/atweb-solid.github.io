import MarkdownRenderer from "@/components/MarkdownRenderer";
import { UsePico } from "@/components/UsePico";
import type { PageMeta } from "@/lib/atproto/atweb-unauthed";
import { pageMetaSignal } from "@/lib/solid/contexts";
import type { At } from "@atcute/client/lexicons";
import { useLocation, useSearchParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal, For, Suspense } from "solid-js";

export default function PreviewPage() {
    const searchParams = createMemo(() => {
        const location = useLocation();
        return new URLSearchParams(location.hash.slice(1));
    });

    const pageMeta = createMemo(() => {
        const params = searchParams();

        console.log('rendering1?', searchParams());
        return {
            did: decodeURIComponent(params.get('did') ?? '') as At.DID,
            filePath: decodeURIComponent(params.get('filePath') ?? ''),
            markdown: decodeURIComponent(params.get('markdown') ?? ''),
        };
    });

    createEffect(() => {
        const [, setPageMeta] = pageMetaSignal;
        setPageMeta(pageMeta());
    });

    const [errors, setErrors] = createSignal<unknown[]>([]);

    return <>
        {errors().length
            ? <div class="errors" v-if="submitErrors.length">
                Errors:
                <ul>
                    <For each={errors()}>
                        {error => <li>{String(error)}</li>}
                    </For>
                </ul>
            </div>
            : <></>}
        <div class="page">
            <Suspense>
                <UsePico>
                    <main>
                        <MarkdownRenderer markdown={pageMeta().markdown} onError={err => setErrors([err])} onCompile={() => setErrors([])} />
                    </main>
                </UsePico>
            </Suspense>
        </div>
    </>;
}