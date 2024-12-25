import { type Signal, createSignal } from "solid-js";

export function signal<T>(): { signal: Signal<T | undefined>, value: T | undefined };
export function signal<T>(initialValue: T): { signal: Signal<T>, value: T };
export function signal<T>(initialValue?: T): { signal: Signal<T>, value: T } {
    const [get, update] = createSignal(initialValue);

    return {
        signal: [get, update] as const,
        get value() {
            return get();
        },
        set value(newValue) {
            update(newValue as Parameters<typeof update>[0]);
        }
    }
}

export type Awaitable<T> = Promise<T> | T;