import type { JSX } from "solid-js";
import styles from "./Blink.module.css";

export default function blink({ children, ...rest }: { children: JSX.Element } & JSX.HTMLAttributes<HTMLSpanElement>) {
    return <span {...rest} class={styles.blink}>
        {children}
    </span>
}
