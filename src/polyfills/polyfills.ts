import {
    AbortControllerPolyfill,
    AbortSignalPolyfill,
    EventTargetPolyfill,
} from "./abort";
import { PromisePolyfill } from "./promise";

// eslint-disable-next-line @typescript-eslint/no-namespace -- grouping functions for a nicer API I.e. polyfills.x
export namespace polyfills {
    export function AbortController() {
        if (typeof window.AbortController === "undefined") {
            window.AbortController = AbortControllerPolyfill;
            window.AbortSignal = AbortSignalPolyfill;
        }
    }

    export function EventTarget() {
        if (typeof window.EventTarget === "undefined") {
            window.EventTarget = EventTargetPolyfill;
        }
    }

    export function Promise() {
        if (typeof window.Promise === "undefined") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Missing allSettled implementation and 'species' symbol parameter
            window.Promise = PromisePolyfill as any;
        }
    }

    export function minimum() {
        Promise();
    }
}
