import {
    getSession,
    OAuthUserAgent,
    type Session,
} from '@atcute/oauth-browser-client';
import type { At } from '@atcute/client/lexicons';

import { AtpOauthClient } from './oauth';
import { KittyAgent } from './kitty-agent';
import { AtwebClient } from './atweb-client';
import { getDidAndPds } from './pds-helpers';
import { resolveHandleAnonymously } from './handles/resolve';
import { signal } from '../utils';
import { createComputed, createEffect, createMemo, createSignal } from 'solid-js';
import { useLocalStorage } from 'solidjs-hooks';

export interface Account {
    handle: string;
    did: At.DID;
    pds: string;
}

export interface Agents {
    agent: KittyAgent;
    client: AtwebClient;
}

// TODO computations created outside a `createRoot` or `render` will never be disposed
// use createContext/useContext?
const [account, setAccount] = useLocalStorage<Account | null>('user', null, {
    deserializer(raw) {
        return JSON.parse(raw);
    },
    serializer(value) {
        return JSON.stringify(value);
    },
});
const [agents, setAgents] = createSignal<Agents | undefined>();

class LoginState {
    get handle(): string { return account()!.handle; }
    get did(): At.DID { return account()!.did; }
    get pds(): string { return account()!.pds; }
    get agent(): KittyAgent { return agents()!.agent; }
    get client(): AtwebClient { return agents()!.client; }
}

export type User = { [K in keyof LoginState]: LoginState[K] };

export const user = createMemo(() => {
    return account() !== undefined && agents() !== undefined ? new LoginState() : undefined;
});

const oauthClient = new AtpOauthClient();
export async function authenticateIfNecessary(
    handle: string,
    refreshOnlyOrShowInputCodeModal: boolean | (() => Promise<string>),
) {
    if (!agents() || !account() || account()!.handle !== handle) {
        let session: Session | undefined;
        try {
            session = await getSession(
                await resolveHandleAnonymously(handle),
                { allowStale: false },
            );
        } catch (err) {
            console.warn('Could not refresh session:', err);
        }

        console.log('seession', session);

        if (refreshOnlyOrShowInputCodeModal === true && !session) return false;

        session ??= await oauthClient.authenticate(handle, refreshOnlyOrShowInputCodeModal as () => Promise<string>);

        const oauthAgent = new OAuthUserAgent(session);

        setAccount({
            ...(await getDidAndPds(handle)),
            handle,
        });

        setAgents({
            agent: new KittyAgent({ handler: oauthAgent }),
            client: new AtwebClient(),
        });

        return true;
    }
}

function isTokenUsable({ token }: Session): boolean {
    const expires = token.expires_at;
    return expires == null || Date.now() + 60_000 <= expires;
}

let initialSessionPromise: Promise<void> | undefined;
export async function waitForInitialSession() {
    if (!initialSessionPromise) {
        initialSessionPromise = (async () => {
            if (account()) { // automatically sign in if possible
                const result = await authenticateIfNecessary(account()!.handle, true);
                console.log(`early authentication complete: ${result}`);
            }
        })();
    }

    await initialSessionPromise;
}
