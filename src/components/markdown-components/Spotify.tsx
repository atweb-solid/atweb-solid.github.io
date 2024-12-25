import { type EmbedController, useSpotifyIFrameAPI } from '@/lib/spotify';
import { onMount, createEffect, createSignal, onCleanup } from 'solid-js';

export default function Spotify(props: {
    uri?: string;
    width?: number;
    height?: number;
}) {
    let spotifyElement: HTMLElement;
    const [EmbedController, setEmbedController] = createSignal<EmbedController>();
    const IFrameAPI = useSpotifyIFrameAPI();

    onMount(() => {
        createEffect(() => {
            if (!IFrameAPI()) return;
            IFrameAPI()!.createController(spotifyElement, {
                uri: props.uri,
                width: props.width,
                height: props.height,
            }, controller => {
                setEmbedController(controller);
            });
        })
    });
    onCleanup(() => {
        EmbedController()?.destroy();
    });

    return <div ref={el => spotifyElement = el}></div>
}

