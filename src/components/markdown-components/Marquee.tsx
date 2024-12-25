import { onMount, type JSX } from "solid-js";
import styles from "./Marquee.module.css";
import { useInterval } from "solidjs-hooks";

export default function marquee(props: { party?: boolean, children: JSX.Element }) {
    let element: HTMLElement;
    if (props.party) {
        onMount(() => {
            useInterval(() => {
                const r = Math.floor(Math.random() * 255)
                const g = Math.floor(Math.random() * 255)
                const b = Math.floor(Math.random() * 255)
                element.style.color = `rgb(${r}, ${g}, ${b})`
            }, 400);
        });
    }

    return <p class={styles.marquee} ref={el => element = el} style="width: inherit;">
        <span>{props.children}</span>
    </p>;
}