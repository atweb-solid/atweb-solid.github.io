import { Thunk, Action } from "../types";
export declare function cropPlaylist(): Thunk;
export declare function removeSelectedTracks(): Thunk;
export declare function removeAllTracks(): Thunk;
export declare function reverseList(): Action;
export declare function randomizeList(): Action;
export declare function sortListByTitle(): Thunk;
export declare function setPlaylistScrollPosition(position: number): Action;
export declare function scrollNTracks(n: number): Thunk;
export declare function scrollPlaylistByDelta(e: WheelEvent): Thunk;
export declare function scrollUpFourTracks(): Thunk;
export declare function scrollDownFourTracks(): Thunk;
export declare function dragSelected(offset: number): Thunk;
export declare function invertSelection(): Action;
export declare function selectZero(): Action;
export declare function selectAll(): Action;
