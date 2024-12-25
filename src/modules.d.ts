declare module 'butterchurn';
declare module '#webamp-lazy' {
    export type * from '@/extern/webamp/built/types/js/types';
    export * from '@/extern/webamp/built/types/js/webampLazy';
    import Webamp from '@/extern/webamp/built/types/js/webampLazy';
    export default Webamp;
}

declare module 'https://open.spotify.com/embed/iframe-api/v1';

declare module '@vanillawc/wc-marquee';
declare module '@vanillawc/wc-social-link';
