import { useVanillaCssSignal } from "@/lib/shared-globals";
import { atUrlProperty } from "@/lib/solid-utils";
import { onCleanup, type JSX } from "solid-js";
import { useTitle } from "solidjs-use";

export function AtAnchor({href, children, ...rest}: { href?: string; children: JSX.Element; } & JSX.HTMLAttributes<HTMLAnchorElement>) {
    const realHref = atUrlProperty(href, 'a');

    return <a href={realHref()} {...rest}>{children}</a>;
}

export function AtImg({src, srcset, ...rest}: { src?: string; srcset?: string; } & JSX.HTMLAttributes<HTMLImageElement>) {
    const realSrc = atUrlProperty(src, 'img', true);
    const realSrcSet = atUrlProperty(srcset, 'img', true);

    return <img src={realSrc()} srcset={realSrcSet()} {...rest} />;
}

export function AtLink({href, ...rest}: { href?: string; } & JSX.HTMLAttributes<HTMLLinkElement>) {
    const realHref = atUrlProperty(href, 'link');

    return <link href={realHref()} {...rest} />;
}

export function AtStyle({children, ...rest}: { children: JSX.Element; } & JSX.HTMLAttributes<HTMLStyleElement>) {
    return <style {...rest}>{children}</style>;
}

export function AtWebStylesheet({href}: { href?: string; }) {
    const realHref = atUrlProperty(href, 'AtWebStylesheet');

    return <link rel="stylesheet" type="text/css" href={realHref()} />;
}

export function AtTitle(props: { children: JSX.Element }) {
    const [title, setTitle] = useTitle();
    setTitle(`${props.children}`.trim());
    return <></>;
}

export function OmitVanillaCss() {
    const [useVanillaCss, setUseVanillaCss] = useVanillaCssSignal;
    setUseVanillaCss(false);
    onCleanup(() => {
        setUseVanillaCss(true);
    });
}