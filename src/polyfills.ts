
// IE doesn't support AbortController at all

export class AbortControllerPolyfill {
    constructor() {
        this.signal = new AbortSignalPolyfill();
    }

    public readonly signal: AbortSignalPolyfill;

    public abort(reason?: unknown) {
        this.signal._abort(reason);
    }
}

export class AbortSignalPolyfill extends EventTarget {
    #aborted = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The standard specifies any
    #reason: any = undefined;

    /**
      * This should be private but there is no other way in userland to trigger the signal, so
      * has to be an internal public api.
      */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The standard specifies any
    public _abort(reason: any) {
        if (this.#aborted) return;

        this.#aborted = true;

        if (reason === undefined) {
            reason = new DOMException('Aborted', 'AbortError');
        }
        this.#reason = reason;

        const evt = new Event('aborted');
        this.dispatchEvent(evt);
        if (this.onabort) {
            this.onabort(evt);
        }
    }

    throwIfAborted() {
        if (this.#aborted) {
            throw this.reason;
        }
    }

    public onabort: ((evt: Event) => void) | null = null;

    public get aborted() { return this.#aborted; }
    public get reason() { return this.#reason; }

    public static abort(): AbortSignal {
        const res = new AbortControllerPolyfill();
        res.abort();
        return res.signal;
    }

    public static timeout(timeout: number): AbortSignal {
        // TODO: the documentation notes a difference when aborting due to browser stop button:
        // https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
        // not sure if that is poly-fillable
        const res = new AbortControllerPolyfill();
        setTimeout(() => {
            const ex = new DOMException('Timeout', 'TimeoutError');
            res.abort(ex);
        }, timeout);
        return res.signal;
    }
}

export const addPolyfills = {
    AbortController() {
        if (typeof AbortController === 'undefined') {
            window.AbortController = AbortControllerPolyfill;
            window.AbortSignal = AbortSignalPolyfill;
        }
    }
};