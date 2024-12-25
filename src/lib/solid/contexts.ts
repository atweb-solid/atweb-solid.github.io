import { createContext, createSignal } from "solid-js";
import type { PageMeta, Page } from "../atproto/atweb-unauthed";

export const pageSignal = createSignal<Page>();
export const pageMetaSignal = createSignal<PageMeta>();