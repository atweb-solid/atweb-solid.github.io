import { children } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

export function UsePico(props: { children: JSX.Element }) {
    const c = children(() => props.children);

    return <>
        <div class="pico">
            <div class="pico-root">
                {c()}
            </div>
        </div>
    </>;
}