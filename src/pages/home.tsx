import { createSignal, type Signal } from 'solid-js';
import index from '@/../README.md?raw';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { UsePico } from '@/components/UsePico';

export default function Home() {
    return <>
        <UsePico>
            <main>
                <MarkdownRenderer markdown={index}/>
            </main>
        </UsePico>
    </>
}
