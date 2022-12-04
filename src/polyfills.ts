import { arrayFind } from "./internal/util/arrayFind";
import { arrayRemoveWhere } from "./internal/util/arrayRemoveWhere";

function resolveAddEventListenerOptions(options?: boolean | AddEventListenerOptions): Readonly<AddEventListenerOptions> {
    if (typeof options !== 'undefined') {
        if (typeof options === 'boolean') {
            return {
                capture: options
            };
        } else {
            return options;
        }
    }

    return {};
}

function resolveEventListenerOptions(options?: boolean | EventListenerOptions): Readonly<EventListenerOptions> {
    if (typeof options !== 'undefined') {
        if (typeof options === 'boolean') {
            return {
                capture: options
            };
        } else {
            return options;
        }
    }

    return {};
}

interface Handler {
    callback: EventListenerOrEventListenerObject;
    options: AddEventListenerOptions;
}

interface Handlers {
    capturing: Handler[];
    nonCapturing: Handler[];
}

// IE doesn't support AbortController at all
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener there is a bunch of 
// options that we are supposed to consider
export class EventTargetPolyfill implements EventTarget {
    private _eventTarget_byType: Map<string, Handlers> = new Map();

    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions
    ): void {

        if (callback === null) {
            return; // Not sure why this is allowed
        }

        const resolvedOptions = resolveAddEventListenerOptions(options);

        let handlers = this._eventTarget_byType.get(type);
        if (!handlers) {
            handlers = {
                capturing: [],
                nonCapturing: []
            };
            this._eventTarget_byType.set(type, handlers);
        }

        const list = resolvedOptions.capture ? handlers.capturing : handlers.nonCapturing;

        const foundExisting = arrayFind(list, x => x.callback === callback);
        if (foundExisting) {
            foundExisting.options = resolvedOptions;
        }
        else {
            list.push({
                callback: callback,
                options: resolvedOptions
            });
        }

        if (resolvedOptions.signal) {
            resolvedOptions.signal.addEventListener('abort', () => {
                this.removeEventListener(type, callback, options);
            });
        }
    }

    removeEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | EventListenerOptions
    ): void {

        if (callback === null) {
            return;
        }

        const handlers = this._eventTarget_byType.get(type);
        if (!handlers) {
            return;
        }

        const resolvedOptions = resolveEventListenerOptions(options);

        const list = resolvedOptions.capture ? handlers.capturing : handlers.nonCapturing;

        arrayRemoveWhere(list, x => x.callback === callback);
    }

    dispatchEvent(event: Event): boolean {
        const handlers = this._eventTarget_byType.get(event.type);

        if (!handlers) {
            return false;
        }

        handlers.capturing.forEach(item => {
            if (typeof item.callback === 'function') {
                item.callback(event);
            }
            else {
                item.callback.handleEvent(event);
            }

            if (item.options.once) {
                this.removeEventListener(event.type, item.callback, { capture: true });
            }
        });

        handlers.nonCapturing.forEach(item => {
            if (typeof item.callback === 'function') {
                item.callback(event);
            }
            else {
                item.callback.handleEvent(event);
            }

            if (item.options.once) {
                this.removeEventListener(event.type, item.callback, { capture: false });
            }
        });

        return event.cancelable && event.defaultPrevented;
    }
}

export class AbortControllerPolyfill {
    constructor() {
        this.signal = new AbortSignalPolyfill();
    }

    public readonly signal: AbortSignalPolyfill;

    public abort(reason?: unknown) {
        this.signal._abort(reason);
    }
}

export class AbortSignalPolyfill extends EventTargetPolyfill {
    constructor() {
        super();
    }

    _aborted = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The standard specifies any
    _reason: any = undefined;

    /**
      * This should be private but there is no other way in userland to trigger the signal, so
      * has to be an internal public api.
      */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The standard specifies any
    public _abort(reason: any) {
        if (this._aborted) return;

        this._aborted = true;

        if (reason === undefined) {
            reason = new DOMException('Aborted', 'AbortError');
        }
        this._reason = reason;

        const evt = new Event('aborted');
        this.dispatchEvent(evt);
        if (this.onabort) {
            this.onabort(evt);
        }
    }

    throwIfAborted() {
        if (this._aborted) {
            throw this.reason;
        }
    }

    public onabort: ((evt: Event) => void) | null = null;

    public get aborted() { return this._aborted; }
    public get reason() { return this._reason; }

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

export const polyfills = {
    AbortController() {
        if (typeof AbortController === 'undefined') {
            window.AbortController = AbortControllerPolyfill;
            window.AbortSignal = AbortSignalPolyfill;
        }
    }
};