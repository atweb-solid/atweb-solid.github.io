import MarkdownRenderer from '@/components/MarkdownRenderer';
import { UsePico } from '@/components/UsePico';
import { downloadFile, getGetBlobUrl } from '@/lib/atproto/atweb-unauthed';
import { resolveHandleAnonymously } from '@/lib/atproto/handles/resolve';
import { filepathToRkey } from '@/lib/atproto/rkey';
import { pageMetaSignal, pageSignal } from '@/lib/solid/contexts';
import { createAsync, useParams } from '@solidjs/router';
import { batch, createComputed, createEffect, createSignal, Suspense } from 'solid-js';

export default function Page() {
    const params = useParams<{ handle: string, page: string }>();

    const page = createAsync(async () => {
        const {handle, page} = params;

        const did = await resolveHandleAnonymously(handle);

        // replace : with / as fallback for older rkey-based path parameters
        return await downloadFile(did, filepathToRkey(page.replace(/:/g, '/')));
    });

    const meta = createAsync<{ type: 'markdown' | 'pre' | 'image' | 'generic' | 'none', contents: string } | undefined>(async () => {
        const thePage = page();

        if (!thePage) return undefined;

        console.log(thePage);

        if (thePage.bodyOriginal.mimeType === 'text/mdx') {
            console.log('setting md');
            return { type: 'markdown', contents: thePage.blobString };
        } else if (thePage.bodyOriginal.mimeType.startsWith('image/')) {
            return { type: 'image', contents: await getGetBlobUrl(thePage.uri, true)};
        } else if (thePage.bodyOriginal.mimeType.startsWith('text/')) {
            return { type: 'pre', contents: thePage.blobString };
        } else {
            return { type: 'generic', contents: await getGetBlobUrl(thePage.uri) };
        }
    });

    createEffect(() => {
        const [, setPageMeta] = pageMetaSignal;
        const [, setPage] = pageSignal;
        setPageMeta(page());
        setPage(page());
    });

    console.log('rendering?');

    return (
        <div class="page">
            {
                meta()?.type === 'markdown' ?
                    <Suspense>
                        <UsePico>
                            <main>
                                <MarkdownRenderer markdown={page()?.blobString ?? 'Loading...'} />
                            </main>
                        </UsePico>
                    </Suspense> :
                meta()?.type === 'image' ?
                    <img src={meta()?.contents} /> :
                meta()?.type === 'pre' ?
                    <pre>{meta()?.contents}</pre> :
                meta()?.type === 'generic' ? <>
                    <a href={meta()?.contents}>
                        Unknown file type <code>{ page()?.bodyOriginal?.mimeType }</code>.
                        Click to download blob.
                    </a>
                </> :
                <>Loading...</>
            }
        </div>
    );
}
