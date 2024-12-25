import { createAsync } from '@solidjs/router';
import { createEffect, createSignal, on, onCleanup, onMount } from 'solid-js';
import { useObjectUrl } from 'solidjs-use';

export default function Userbar(props: {
    width?: number;
    height?: number;
    text?: string;
    textColor?: string;

    backgroundType?: "gradient" | "plain";
    backgroundPositionX?: number;
    backgroundPositionY?: number;
    backgroundEndPositionX?: number;
    backgroundEndPositionY?: number;
    backgroundColor?: string;
    backgroundColors?: string[];

    textAlign?: "left" | "center" | "right";
    textBorder?: boolean;
    textBorderWidth?: number;
    textBorderColor?: string;
    pattern?: "none" | "dots" | "stripes";
    topShadow?: boolean;
}) {
    const blob = createAsync(async () => {
        const { default: userbarGenerator } = await import('@/extern/userbar-generator/src/index');

        return await userbarGenerator({
            width: props.width,
            height: props.height,
            text: props.text,
            textColor: props.textColor,
        
            background: props.backgroundType !== undefined ? {
                type: props.backgroundType,
                positionX: props.backgroundPositionX,
                positionY: props.backgroundPositionY,
                endPositionX: props.backgroundEndPositionX,
                endPositionY: props.backgroundEndPositionY,
                colors: props.backgroundColors ?? (props.backgroundColor ? [props.backgroundColor] : undefined) ?? [],
            } : undefined,
        
            textAlign: props.textAlign,
            textBorder: props.textBorder,
            textBorderWidth: props.textBorderWidth,
            textBorderColor: props.textBorderColor,
            pattern: props.pattern,
            topShadow: props.topShadow,
        });
    });

    const [objectUrl, setObjectUrl] = createSignal<string>();

    createEffect(on(() => blob(), blob => {
        if (objectUrl()) {
            URL.revokeObjectURL(objectUrl()!);
        }
        if (blob) {
            setObjectUrl(URL.createObjectURL(blob));
        }
    }));

    onCleanup(() => {
        if (objectUrl()) {
            URL.revokeObjectURL(objectUrl()!);
        }
    });

    return <img src={objectUrl()} />
}
