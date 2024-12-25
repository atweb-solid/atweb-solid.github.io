import { lazy } from 'solid-js';
import { AtAnchor, AtImg, AtLink, AtStyle, AtTitle, AtWebStylesheet, OmitVanillaCss } from './AtComponents';
import Webamp from './Webamp';
import Spotify from './Spotify';
import Oneko from './Oneko';
import blink from './Blink';
import LesbiBadge from './LesbiBadge';
import Userbar from './Userbar';
import { BlueskyPost, BlueskyProfileCard, BlueskyProfileFeed } from './BlueskyElements';
import marquee from './Marquee';
import SocialLink from './SocialLink';
import Json from './Json';
import RingLink from './RingLink';

export const components = {
    img: AtImg,
    link: AtLink,
    a: AtAnchor,
    Stylesheet: AtWebStylesheet,
    OmitVanillaCss: OmitVanillaCss,
    style: AtStyle,
    title: AtTitle,
    Webamp: Webamp,
    Spotify: Spotify,
    Oneko: Oneko,
    blink: blink,
    LesbiBadge: LesbiBadge,
    // Badge: EightyEightThirtyOneBadge,
    Userbar: Userbar,
    RingLink: RingLink,
    BlueskyPost: BlueskyPost,
    BlueskyProfileCard: BlueskyProfileCard,
    BlueskyProfileFeed: BlueskyProfileFeed,
    Json: Json,
    marquee: marquee,
    SocialLink: SocialLink,
};
