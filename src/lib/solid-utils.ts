import { createEffect, createSignal, on } from "solid-js";
import { getRelativeOrAbsoluteBlobUrl } from "./component-helpers";
import { pageMetaSignal } from "./solid/contexts";

export function atUrlProperty(src: string | undefined, elementName: string, useCdn = false) {
    const [prop, setProp] = createSignal<string>();

    const [pageMeta] = pageMetaSignal;
    createEffect(on(() => pageMeta(), async pageMeta => {
        try {
            setProp(await getRelativeOrAbsoluteBlobUrl(
                src,
                pageMeta ? { path: pageMeta.filePath, repo: pageMeta.did } : undefined,
                useCdn
            ));
        } catch (err) {
            console.warn(new Error(`for ${elementName}`, { cause: err }));
            return;
        }
    }));

    return prop;
}

/**
 * Converts props to attrs for use in web components.
 * @param obj The object with props
 * @returns obj with keys prefixed with 'attr:'
 */
export function toAttrs<K extends string, V>(obj: { [key in K]?: V }): { [key in `attr:${K}`]?: V } {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => ['attr:' + k, v])) as any;
}

export type EventHelper<E extends Event, El extends Element> = E & { currentTarget: El };
