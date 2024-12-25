import './custom-elements/json/wc-json.js';

import type { JSX } from 'solid-js';

declare module "solid-js" {
    export namespace JSX {
        interface IntrinsicElements {
            'json-element': JSX.HTMLAttributes<HTMLDivElement>;
        }
    }
}

export default function Json({children, ...rest}: { children?: JSX.Element; } & JSX.HTMLAttributes<HTMLDivElement>) {
    return <json-element {...rest}>{children}</json-element>;
}