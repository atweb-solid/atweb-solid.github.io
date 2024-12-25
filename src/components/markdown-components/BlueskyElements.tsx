import 'bluesky-post-embed';
import 'bluesky-profile-card-embed';
import 'bluesky-profile-feed-embed';

import type { JSX } from "solid-js";
import { toAttrs } from "@/lib/solid-utils";

declare module "solid-js" {
    export namespace JSX {
        interface IntrinsicElements {
            'bluesky-post': JSX.HTMLAttributes<HTMLDivElement>;
            'bluesky-profile-card': JSX.HTMLAttributes<HTMLDivElement> & { 'attr:actor'?: string, 'attr:allow-unauthenticated'?: string };
            'bluesky-profile-feed': JSX.HTMLAttributes<HTMLDivElement>;
        }
    }
}

export function BlueskyPost({ children, ...rest }: { children?: JSX.Element } & JSX.IntrinsicElements['bluesky-post']) {
    return <bluesky-post {...toAttrs(rest)}>{children}</bluesky-post>;
}

export function BlueskyProfileCard({ children, ...rest }: { children?: JSX.Element } & JSX.IntrinsicElements['bluesky-profile-card']) {
    return <bluesky-profile-card {...toAttrs(rest)}>{children}</bluesky-profile-card>;
}

export function BlueskyProfileFeed({ children, ...rest }: { children?: JSX.Element } & JSX.IntrinsicElements['bluesky-profile-feed']) {
    return <bluesky-profile-feed {...toAttrs(rest)}>{children}</bluesky-profile-feed>;
}