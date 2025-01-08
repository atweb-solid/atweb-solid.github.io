import 'bluesky-profile-card-embed';

import Modal from "@/components/Modal"
import SignInGate from "@/components/SignInGate"
import { UsePico } from "@/components/UsePico"
import { getRingsUserIsAMemberOf, type getRing } from '@/lib/atproto/atweb-unauthed';
import { AtUri } from '@atproto/syntax';
import { createEffect, createMemo, createSignal, For, on } from 'solid-js';
import { user, waitForInitialSession } from '@/lib/atproto/signed-in-user';
import { resolveHandleAnonymously } from '@/lib/atproto/handles/resolve';
import { useClipboard } from 'solidjs-use';
import { rkeyToFilepath } from '@/lib/atproto/rkey';
import type { EventHelper } from '@/lib/solid-utils';
import { createAsync, useLocation } from '@solidjs/router';
import styles from './rings.module.css';
import { getDidAndPds } from 'kitty-agent';

declare module "solid-js" {
    export namespace JSX {
        interface IntrinsicElements {
            'bluesky-post': JSX.HTMLAttributes<HTMLDivElement>;
            'bluesky-profile-card': JSX.HTMLAttributes<HTMLDivElement> & { 'attr:actor'?: string, 'attr:allow-unauthenticated'?: string };
            'bluesky-profile-feed': JSX.HTMLAttributes<HTMLDivElement>;
        }
    }
}

export default function Rings() {
    type Ring = Awaited<ReturnType<typeof getRing>>;

    const [rings, setRings] = createSignal<(Ring & { mainPage: AtUri })[]>();
    // const route = useRoute('/rings');
    const [selectedRing, setSelectedRing] = createSignal<(Ring & { mainPage: AtUri })>();

    waitForInitialSession();

    const location = useLocation();
    createEffect(on(() => [user(), location], async ([user, location]) => {
        if (user)
            await reloadRings();
    }));

    const [createRingModalOpen, setCreateRingModalOpen] = createSignal(false);
    const [createRingName, setCreateRingName] = createSignal('');
    const [createRingMainPage, setCreateRingMainPage] = createSignal('');

    async function createRing() {
        await user()!.client.createRing(
            createRingName(),
            createRingMainPage(),
        );

        await reloadRings();
    }

    const memberNames = createAsync(async () => {
        const members = selectedRing()?.members?.map(e => e.membership);
        if (!members) {
            return {};
        }

        const names: Record<string, string> = {};

        for (const membership of members) {
            const { did, didDocument } = await getDidAndPds(membership.host);
            names[did] = names[membership.toString()] = didDocument.alsoKnownAs?.[0]?.replace('at://', '') ?? did;
        }

        return names;
    });

    function getMemberName(did: string | AtUri) {
        if (typeof did === 'string' && did.startsWith('at://')) did = new AtUri(did);
        if (typeof did !== 'string') did = did.host;
        return memberNames()?.[did] ?? did;
    }

    const [kickMemberModal, setKickMemberModal] = createSignal<{
        did: string,
        displayName: string,
        ring: Ring,
    }>();
    const kickMemberModalOpen = createMemo(() => kickMemberModal() !== undefined);

    async function kickMember(did: string, fromRing: Ring) {
        const members = [...fromRing.members];
        const idx = members?.findIndex(member => member.membership.host === did);
        if (idx !== undefined && idx !== -1) {
            members!.splice(idx, 1);

            await user()!.client.updateRingMembers(fromRing.uri.rkey, members, fromRing.cid);

            await reloadRings();
        }
    }

    const [deleteRingModal, setDeleteRingModal] = createSignal<{
        ring: Ring,
    }>();
    const deleteRingModalOpen = createMemo(() => deleteRingModal() !== undefined);

    async function deleteRing(rkey: string) {
        await user()!.client.deleteRing(rkey);

        await reloadRings();
    }

    const [addMemberModal, setAddMemberModal] = createSignal<{
        ring: Ring,
        handle?: string,
        closed?: boolean,
    }>();
    const addMemberModalOpen = createMemo(() => addMemberModal() !== undefined);

    const [invitedModal, setInvitedModal] = createSignal<{
        ring: Ring,
        handle: string,
        inviteRkey?: string,
    }>();
    const invitedModalOpen = createMemo(() => invitedModal() !== undefined);

    async function addMember(ring: Ring, handle: string) {
        const did = await resolveHandleAnonymously(handle);

        const idx = ring.members?.findIndex(member => member.membership.host === did);
        if (idx !== undefined && idx !== -1) {
            setInvitedModal({
                ring,
                handle,
                inviteRkey: undefined,
            });
            return undefined; // member already invited
        }

        await user()!.client.updateRingMembers(
            ring.uri.rkey,
            [...ring.members, AtUri.make(did, 'io.github.atweb.ringMembership', ring.uri.rkey)],
            ring.cid
        );

        setInvitedModal({
            ring,
            handle,
            inviteRkey: ring.uri.rkey,
        });

        await reloadRings();
    }

    async function reloadRings() {
        setRings([
            ...await getRingsUserIsAMemberOf(user()!.did),
        ]);
        
        // what the fuck is this supposed to do?
        if (selectedRing()) {
            setSelectedRing(rings()!.find(e => e.uri === selectedRing()!.uri));
        }
    }

    const { copy } = useClipboard();
    function copyRingMdx(ring: Ring) {
        copy(
            `<RingLink direction="previous" ringUri="${ring.uri.toString()}" self="${user()!.did}">prev</RingLink>\n` +
                `${ring.name}\n` +
                `<RingLink direction="next" ringUri="${ring.uri.toString()}" self="${user()!.did}">next</RingLink>`
        );
    }

    const [mainPageLink, setMainPageLink] = createSignal('');
    createEffect(on(() => selectedRing(), selectedRing => {
        if (!selectedRing) return;
        setMainPageLink(rkeyToFilepath(selectedRing.mainPage.rkey));
    }));

    async function setMainPage(ring: (Ring & { mainPage: AtUri }), mainPageLink: string) {
        user()!.client.setMainPage(
            ring.members.find(e => e.membership.host === user()!.did)!.membership.rkey,
            mainPageLink
        );
    }

    function onRingSelected(ev: EventHelper<Event, HTMLSelectElement>) {
        setSelectedRing(rings()?.find(ring => ev.currentTarget.value === ring.uri.rkey));
    }

    const isOwnerOfRing = createMemo(() => user() && selectedRing() && selectedRing()!.uri.host === user()!.did);

    return <>
        <UsePico>
            <main>
                <SignInGate>
                    <Modal
                        open={createRingModalOpen()}
                        okText="Create"
                        cancelText="Cancel"
                        onClickOk={() => createRing().then(() => setCreateRingModalOpen(false))}
                        onClickCancel={() => setCreateRingModalOpen(false)}
                    >
                        <label>
                            @ring Name
                            <input
                                type="text"
                                value={createRingName()}
                                onInput={el => setCreateRingName(el.currentTarget.value)} />
                        </label>
                        <label>
                            My Member Page
                            <input
                                type="text"
                                value={createRingMainPage()}
                                onInput={el => setCreateRingMainPage(el.currentTarget.value)}
                                placeholder="index.mdx" />
                        </label>
                    </Modal>

                    <Modal
                        open={kickMemberModalOpen()}
                        okText="Yes, kick them"
                        cancelText="No, go back"
                        onClickOk={() => kickMember(kickMemberModal()!.did, kickMemberModal()!.ring).then(() => setKickMemberModal(undefined))}
                        onClickCancel={() => setKickMemberModal(undefined)}
                    >
                        <b>Really</b> kick @{kickMemberModal()?.displayName} from {kickMemberModal()?.ring.name}?
                    </Modal>

                    <Modal
                        open={deleteRingModalOpen()}
                        okText="Yes, delete it"
                        cancelText="No, go back"
                        onClickOk={() => deleteRing(deleteRingModal()!.ring.uri.rkey).then(() => setDeleteRingModal(undefined))}
                        onClickCancel={() => setDeleteRingModal(undefined)}
                    >
                        <b>Really</b> delete {deleteRingModal()!.ring.name}? There's no going back!
                    </Modal>

                    <Modal
                        open={addMemberModalOpen()}
                        okText="Send invite"
                        cancelText="Cancel"
                        onClickOk={() => addMember(addMemberModal()!.ring, addMemberModal()!.handle!).then(() => setAddMemberModal(undefined))}
                        onClickCancel={() => setAddMemberModal(undefined)}
                    >
                        <label>
                            @handle to invite
                            <input
                                type="text"
                                value={addMemberModal()!.handle}
                                onInput={el => setAddMemberModal({ ...addMemberModal()!, handle: el.currentTarget.value })}
                                placeholder="someone.bsky.social" />
                        </label>
                    </Modal>

                    <Modal
                        open={invitedModalOpen()}
                        hideCancel={true}
                        onClickOk={setInvitedModal(undefined)}
                    >
                        {invitedModal()!.inviteRkey ? 
                            <div>
                                Send this invite link to @{ invitedModal()!.handle } so they can join your webring.
                                <pre>{ `https://${document.location.host}/invited/${invitedModal()!.ring.uri.host}/${invitedModal()!.inviteRkey}` }</pre>
                            </div> :
                            <div>
                                Account is already invited.
                            </div>
                        }
                    </Modal>
                    <fieldset>
                        <div>
                            <button onClick={() => setCreateRingModalOpen(true)} class={styles.formElementWidthAuto}> Create new @ring</button>

                            <select onChange={onRingSelected} aria-label="Select an @ring to edit it" class={styles.formElementWidthAuto}>
                                <option value={undefined}>
                                    Select an @ring to edit it
                                </option>
                                <For each={rings()}>
                                    {item => <option value={item.uri.rkey}>
                                        { item.name }
                                    </option>}
                                </For>
                            </select>
                        </div>

                        {selectedRing() ? <div>
                            <h2>{ selectedRing()?.name }</h2>
                            <p><code>{ selectedRing()?.uri.toString() }</code></p>
                            <p><b>{ selectedRing()?.members?.length ?? 0 }</b> member(s)</p>
                            <p>Managed by <a href={`https://bsky.app/profile/${selectedRing()!.uri.host}`}>@{ getMemberName(selectedRing()!.uri) }</a></p>

                            <fieldset>
                                <button onClick={() => copyRingMdx(selectedRing()!)} class={styles.formElementWidthAuto}>Copy ring MDX code</button>
                            </fieldset>

                            <div>
                                <label>
                                    My main page<br/>
                                    <input
                                        type="text"
                                        value={mainPageLink()}
                                        onInput={el => setMainPageLink(el.currentTarget.value)}
                                        class={styles.formElementWidthAuto} />
                                    <button onClick={() => setMainPage(selectedRing()!, mainPageLink()!)} class={styles.formElementWidthAuto}>Set</button>
                                </label>
                            </div>

                            <For each={selectedRing()?.members ?? []}>
                                {member => <>
                                    <div class={styles.ringMemberCard}>
                                        <fieldset>
                                            <bluesky-profile-card attr:actor={getMemberName(member.membership)} attr:allow-unauthenticated="true" />
                                            {!member.isMember ? <div>Waiting for invite response</div> : <></>}

                                            {isOwnerOfRing() ? <button onClick={() => {
                                                setKickMemberModal({
                                                    did: member.membership.host,
                                                    displayName: getMemberName(member.membership),
                                                    ring: selectedRing()!,
                                                });
                                            }} class={styles.kickMemberButton}>
                                                Kick @{ getMemberName(member.membership) }
                                            </button> : <></>}
                                        </fieldset>
                                    </div>
                                </>}
                            </For>

                            <hr />
                            {isOwnerOfRing() ? <>
                                <button class={styles.formElementWidthAuto} onClick={() => {
                                    setAddMemberModal({
                                        ring: selectedRing()!,
                                        handle: '',
                                    })
                                }}>
                                    Invite new member
                                </button>

                                <button class={styles.formElementWidthAuto} onClick={() => {
                                    setDeleteRingModal({
                                        ring: selectedRing()!,
                                    })
                                }}>
                                    Delete { selectedRing()!.name }
                                </button>
                            </> : <></>}
                        </div> : <></>}
                    </fieldset>
                </SignInGate>
            </main>
        </UsePico>
    </>;
}