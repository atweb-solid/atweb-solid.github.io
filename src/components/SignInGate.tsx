import { authenticateIfNecessary, user } from "@/lib/atproto/signed-in-user";
import { children, createEffect, createSignal, type JSX, on } from "solid-js";

export default function SignInGate(props: {
    signInButtonClass?: string,
    signInText?: string,
    children: JSX.Element,
}) {
    const [handle, setHandle] = createSignal('');
    const [hash, setHash] = createSignal('');
    const [open, setOpen] = createSignal(false);
    const [codePasteOpen, setCodePasteOpen] = createSignal(false);
    const slot = children(() => props.children);

    let finishAuthentication: () => void = () => {};
    let cancelAuthentication: () => void = () => {};

    createEffect(on(() => user(), user => {
        setHandle(user?.handle ?? '');
    }));

    async function authenticate() {
        authenticateIfNecessary(handle(), () => {
            return new Promise((resolve, reject) => {
                finishAuthentication = () => resolve(hash());
                cancelAuthentication = reject;
                setCodePasteOpen(true);
            });
        });
    }

    return <>
        {!user()
            ? <button class={props.signInButtonClass} v-if="!user" onClick={() => setOpen(true)}>{ props.signInText ?? 'Sign in' }</button>
            : slot}
        
        <dialog open={open()}>
            <article>
                <label>
                    @handle
                    <input
                        value={handle()}
                        onInput={event => setHandle(event.currentTarget.value)}
                        type="text"
                        placeholder="e.g. you.bsky.social" />
                </label>

                <footer>
                    <button class="secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </button>
                    <button onClick={() => authenticate().then(() => setOpen(false))}>
                        Sign In
                    </button>
                </footer>
            </article>
        </dialog>

        <dialog open={codePasteOpen()}>
            <article>
                <label>
                    Input displayed code
                    <input
                        value={hash()}
                        onInput={event => setHash(event.currentTarget.value)}
                        type="text" />
                </label>

                <footer>
                    <button class="secondary" onClick={() => { cancelAuthentication(); setCodePasteOpen(false); } }>
                        Cancel
                    </button>
                    <button onClick={() => { finishAuthentication(); setCodePasteOpen(false); } }>
                        Complete Sign In
                    </button>
                </footer>
            </article>
        </dialog>

    </>
}