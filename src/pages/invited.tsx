import SignInGate from "@/components/SignInGate";
import { UsePico } from "@/components/UsePico";
import { getRing } from "@/lib/atproto/atweb-unauthed";
import { getDidAndPds } from "@/lib/atproto/pds-helpers";
import { user, waitForInitialSession } from "@/lib/atproto/signed-in-user";
import { createAsync, useParams } from "@solidjs/router";
import { createSignal } from "solid-js";

export default function Invited() {
    const params = useParams<{ inviterDid: string, ringAndInviteRkey: string }>();

    const inviterHandle = createAsync(async () => {
        const { didDocument } = await getDidAndPds(params.inviterDid);
        return didDocument.alsoKnownAs?.[0].replace('at://', '') ?? params.inviterDid;
    });
    
    const [mainPage, setMainPage] = createSignal('');
    const [inviteAccepted, setInviteAccepted] = createSignal<boolean | string>(false);
    
    waitForInitialSession();
    
    async function acceptInvite() {
        const ring = await getRing(params.inviterDid, params.ringAndInviteRkey);
        if (!ring.members.some(member => member.membership.host === user()!.did))
            return; // invite was rescinded
    
        await user()!.client.acceptInvite(params.inviterDid, params.ringAndInviteRkey, mainPage());
    
        setInviteAccepted(ring.name);
    }

    return <>
        <UsePico>
            <main>
                <SignInGate signInText={`Sign in to view invite from @${inviterHandle()}`}>
                    {!inviteAccepted() ? <div>
                        <p>
                            Accept this invite from @{ inviterHandle() }?
                        </p>
                        <div>
                            <label>
                                My Member Page
                                <input type="text" value={mainPage()} onInput={el => setMainPage(el.currentTarget.value)} placeholder="index.mdx" />
                            </label>
                            <button onClick={acceptInvite} style="vertical-align: text-top; margin-top: -1px">OK</button>
                        </div>
                    </div> : <div>
                        Welcome to { inviteAccepted() }!
                    </div>}
                </SignInGate>
            </main>
        </UsePico>
    </>
}
