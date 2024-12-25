import { getRing } from '@/lib/atproto/atweb-unauthed';
import { rkeyToFilepath } from '@/lib/atproto/rkey';
import { AtUri } from '@atproto/syntax';
import { createAsync } from '@solidjs/router';
import { createEffect, createSignal, type JSX, on } from 'solid-js';

export default function RingLink({ direction = 'previous', ringUri, self, children, ...rest }: {
    children: JSX.Element,
    direction?: 'previous' | 'next';
    ringUri: string;
    self: string;
}) {
    const [prevMemberLink, setPrevMemberLink] = createSignal<string>();
    const [nextMemberLink, setNextMemberLink] = createSignal<string>();

    const ring = createAsync(async () => {
        const ringAtUri = new AtUri(ringUri);
    
        return await getRing(ringAtUri.host, ringAtUri.rkey);    
    });

    createEffect(on(() => ring(), ring => {
        if (!ring) return;

        const realMembers = ring.members.filter(e => e.isMember);
        const memberIndex = realMembers.findIndex(member => member.membership.host === self);

        if (memberIndex != -1) {
            const prevMember = ring.members[wrapAround(memberIndex - 1, realMembers.length)];
            const nextMember = ring.members[wrapAround(memberIndex + 1, realMembers.length)];
            setPrevMemberLink(`/page/${prevMember.membership.host}/${rkeyToFilepath(prevMember.mainPage?.rkey ?? '!!! FAILED !!!.mdx')}`);
            setNextMemberLink(`/page/${nextMember.membership.host}/${rkeyToFilepath(nextMember.mainPage?.rkey ?? '!!! FAILED !!!.mdx')}`);
        }
    }));

    function wrapAround(i: number, max: number) {
        if (i >= max) i %= max;
        else if (i < 0) i += max;
        return i;
    }

    return <>
        <a class="va-link" href={direction === 'previous' ? prevMemberLink() : nextMemberLink()} {...rest}>
            {children}
        </a>
    </>
}
