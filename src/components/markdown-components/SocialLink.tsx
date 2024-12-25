import '@vanillawc/wc-social-link';
import type { JSX } from 'solid-js';

declare module "solid-js" {
    export namespace JSX {
        interface IntrinsicElements {
            'wc-social-link': JSX.HTMLAttributes<HTMLDivElement>;
        }
    }
}
export default function SocialLink({children, ...rest}: { children?: JSX.Element; } & JSX.HTMLAttributes<HTMLDivElement>) {
    return <wc-social-link {...rest}>{children}</wc-social-link>;
}