import type { JSX } from "solid-js";

export default function Modal(props: {
    onClickOk?: (ev: MouseEvent) => void,
    onClickCancel?: (ev: MouseEvent) => void,
    cancelText?: string,
    okText?: string,
    hideOk?: boolean,
    hideCancel?: boolean,
    open?: boolean,
    children?: JSX.Element,
}) {
    return <>
        <dialog open={props.open}>
            <article>
                {props.open ? props.children : <></>}

                <footer>
                    {!props.hideCancel ? <button class="secondary" onClick={ev => props.onClickCancel?.(ev)}>
                        { props.cancelText ?? 'Cancel' }
                    </button> : <></>}
                    {!props.hideOk ? <button onClick={ev => props.onClickOk?.(ev)}>
                        { props.okText ?? 'OK' }
                    </button> : <></>}
                </footer>
            </article>
        </dialog>
    </>;
}