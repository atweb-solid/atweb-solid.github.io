import { onMount, type JSX } from "solid-js"
import { render } from "solid-js/web";

export default function ShadowRoot(props: { children: JSX.Element, adoptedStyleSheets?: CSSStyleSheet[] }) {
    let div: HTMLElement;

    onMount(() => {
        const root = div.attachShadow({ mode: 'closed', });
        root.adoptedStyleSheets.push(...(props.adoptedStyleSheets ?? []))
        render(() => props.children, root)
    });

    return <div ref={el => div = el}></div>
}