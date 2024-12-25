import '@/assets/app.scss';

import { createComputed, createMemo, type JSX, Suspense } from 'solid-js';
import { UsePico } from './components/UsePico';
import { A, useLocation } from '@solidjs/router';
import { useVanillaCssSignal } from './lib/shared-globals';
import { frameworkStyles } from './lib/framework-styles';

export default function App(props: { children: JSX.Element }) {
    const location = useLocation();
    const isInPage = createMemo(() => location.pathname.startsWith('/page/') || location.pathname.startsWith('/preview/'));
    const [useVanillaCss] = useVanillaCssSignal;

    return <>
        {isInPage() === false || useVanillaCss() ? <style>{frameworkStyles}</style> : <></>}

        {isInPage() === false
            ? <UsePico>
                <header>
                    <nav>
                        <ul>
                            <li><A href="/"><strong>@web</strong></A></li>
                        </ul>
                        <ul>
                            <li><A href="/edit">Create Page</A></li>
                            <li><A href="/page/did:plc:nmc77zslrwafxn75j66mep6o/test.mdx">Test Page</A></li>
                            <li><A href="/rings">My @rings</A></li>
                        </ul>
                    </nav>
                </header>
            </UsePico>
            : <></>}

        {props.children}
    </>;
};
