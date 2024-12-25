import styles from './edit.module.css';

import { themeNames, themes } from '@/lib/monaco/themes';
import { language as mdxLang, conf as mdxLangConf } from '@/lib/monaco/mdx-lang';

import type * as monaco from 'monaco-editor';
import { createEffect, createMemo, createSignal, For, Suspense } from 'solid-js';
import type { IoGithubAtwebFile } from '@atcute/client/lexicons';
import type { AtUri } from '@atproto/syntax';
import { UsePico } from '@/components/UsePico';
import { useLocalStorage } from 'solidjs-use';
import { user, waitForInitialSession } from '@/lib/atproto/signed-in-user';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { createAsync, useNavigate, useParams } from '@solidjs/router';
import { downloadFile, type Page, type PageMeta } from '@/lib/atproto/atweb-unauthed';
import SignInGate from '@/components/SignInGate';
import { MonacoEditor } from '@/extern/solid-monaco/src';
import { lookupMime } from '@/lib/mime';
import { Portal } from 'solid-js/web';
import { frameworkStyles } from '@/lib/framework-styles';
import ShadowRoot from '@/components/ShadowRoot';
import { filepathToRkey } from '@/lib/atproto/rkey';
import type { EventHelper } from '@/lib/solid-utils';
type monaco = typeof monaco;

const { default: editorWorker } = await import('monaco-editor/esm/vs/editor/editor.worker?worker');
const { default: jsonWorker } = await import('monaco-editor/esm/vs/language/json/json.worker?worker');
const { default: cssWorker } = await import('monaco-editor/esm/vs/language/css/css.worker?worker');
const { default: htmlWorker } = await import('monaco-editor/esm/vs/language/html/html.worker?worker');
const { default: tsWorker } = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker');

const MONACO_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
    fixedOverflowWidgets: true,
    contextmenu: true,
};
self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    }
};

const adoptedStyleSheet = new CSSStyleSheet();
await adoptedStyleSheet.replace(frameworkStyles);

export default function Edit() {
    const [theme, setTheme] = useLocalStorage('monaco-theme', 'Tomorrow Night Bright');
    const [value, setValue] = createSignal('');
    const [language, setLanguage] = createSignal('mdx');
    const [activeFile, setActiveFile] = createSignal('');
    const params = useParams<{ page: string }>();
    const navigate = useNavigate();
    const [pageMeta, setPageMeta] = createSignal<PageMeta>();

    const isMarkdownFile = createMemo(() => !activeFile() || ((lookupMime(activeFile()) ?? 'text/mdx') === 'text/mdx'));

    waitForInitialSession().finally(async () => {
        if (params.page && user()) {
            (async () => {
                setActiveFile(params.page);
        
                const page = await downloadFile(user()!.did, filepathToRkey(params.page));
        
                console.log('setting pageMeta ', page);
                
                setPageMeta(page);
                setValue(page!.blobString);
            })();
        }
    });

    const files = createAsync(async () => {
        if (!user()) return undefined;

        return await user()!.client.listFiles();
    });

    const handleBeforeMount = (monaco: monaco) => {
        for (const [themeName, theme] of Object.entries(themes)) {
            // console.log(themeName, theme);
            monaco.editor.defineTheme(themeName, theme as monaco.editor.IStandaloneThemeData);
        }
        monaco.languages.register({ id: 'mdx', mimetypes: ['text/mdx'] });
        monaco.languages.setLanguageConfiguration('mdx', mdxLangConf);
        monaco.languages.setMonarchTokensProvider('mdx', mdxLang);
    };

    const handleMount = (monaco: monaco, editor: monaco.editor.IStandaloneCodeEditor) => {
        setTheme(theme());
        monaco.editor.setTheme(theme()); // for some reason here it doesn't set it otherwise
    };

    function onActiveFileChange(event: EventHelper<InputEvent, HTMLInputElement>) {
        setActiveFile(event.currentTarget.value);
        console.log(activeFile());
    }

    function onSelectedThemeChange(event: EventHelper<Event, HTMLSelectElement>) {
        setTheme(event.currentTarget.value);
    }

    async function setActiveFileFromFiles(file: IoGithubAtwebFile.Record & { uri: AtUri }) {
        if (!user()) return;

        setActiveFile(file.filePath);

        const page = await downloadFile(user()!.did, file.uri.rkey);

        console.log('setting pageMeta ', page);
        
        setPageMeta(page);
        setValue(page!.blobString);
        navigate(`/edit/${encodeURI(file.filePath)}`);

        return page;
    }

    async function submitPage() {
        if (!user()) {
            alert('Not signed in');
            throw new Error('Not signed in');
        }
    
        if (!activeFile()) {
            alert('File path is empty');
            throw new Error('file path is empty');
        }
    
        const { client, handle } = user()!;
    
        const { rkey } = await client.uploadPage(activeFile(), value());
        setTimeout(() => {
            navigate(`/page/${handle}/${encodeURI(activeFile())}`);
        }, 1000);
    }

    function openPage() {
        if (!user()) {
            alert('Not signed in');
            throw new Error('Not signed in');
        }

        const { handle } = user()!;
        navigate(`/page/${handle}/${encodeURI(activeFile())}`);
    }

    return <>
        <div class={`grid ${styles.grid}`}>
            <div class={styles.left}>
                <UsePico>
                    <aside style="overflow: auto; max-height: calc(100vh - 115.5px); padding: 0 1rem;">
                        <nav>
                            <ul>
                                <For each={files()}>
                                    {file => <>
                                        <li>
                                            {/* active={activeFile() == file.filePath} */}
                                            <a href="javascript: void 0" onclick={() => setActiveFileFromFiles(file)}>{ file.filePath }</a>
                                        </li>
                                    </>}
                                </For>
                            </ul>
                        </nav>
                    </aside>
                </UsePico>
            </div>
            <div class={`${styles.flex} ${styles.middle}`}>
                <UsePico>
                    <div class="inputs" style="padding: 0 0.5rem; --pico-spacing: 0.5rem;">
                        <input value={activeFile()} onInput={onActiveFileChange} type="text" placeholder="index.mdx" aria-label="File path" class={styles.activeFileInput} />
    
                        <SignInGate signInButtonClass="edit-form-button" signInText="Sign in to upload">
                            <button onclick={submitPage} class={styles.submitButton}>Submit</button>

                            {files()?.find(file => file.filePath === activeFile())
                                ? <button v-if="" class="edit-form-button" onclick={openPage}>Open</button>
                                : <></>}
                        </SignInGate>
    
                        <select value={theme()} onChange={onSelectedThemeChange} aria-label="Editor Theme" required class={styles.editorThemeSelector}>
                            <For each={Object.keys(themeNames)}>
                                {themeName => <>
                                    <option value={(themeNames as Record<string, string>)[themeName]}>
                                        { themeName }
                                    </option>
                                </>}
                            </For>
                        </select>
                    </div>
                </UsePico>
    
                <MonacoEditor
                    options={MONACO_EDITOR_OPTIONS}
                    language={language()}
                    theme={theme()}
                    value={value()}
                    onBeforeMount={handleBeforeMount}
                    onMount={handleMount}
                    height="calc(100vh - 115.5px - 86.6px)"
                    onChange={value => {
                        setValue(value);
                    }}
                />
            </div>
            {isMarkdownFile() ? <div class={styles.right} style="min-width: 25vw;">
                <div style="padding: 1rem; max-height: calc(100vh - 115.5px); overflow: auto;">
                    <iframe src={`/preview/` +
                        `#markdown=${encodeURIComponent(value())}` +
                        `&filePath=${encodeURIComponent(pageMeta()?.filePath ?? '')}` +
                        `&did=${encodeURIComponent(pageMeta()?.did ?? '')}`
                    } class={styles.iframe}/>
                </div>
            </div> : <></>}
        </div>
    </>;
}