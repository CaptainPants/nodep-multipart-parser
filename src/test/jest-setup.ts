import {
    TextEncoder as UtilTextEncoder,
    TextDecoder as UtilTextDecoder,
} from "util";

global.TextEncoder = UtilTextEncoder as any;
global.TextDecoder = UtilTextDecoder as any;

// Massive poly fills rewuired for testing under nodejs
/*
import { Blob as BufferBlob } from 'buffer';
import EventEmitter from 'events';

global.Blob = BufferBlob as any;

class EventPoly {
    constructor(type: string, init?: Record<string, any>) {
        this.type = type;
        Object.assign(this, init);
    }

    type: string;
    bubbles: boolean = true;
    cancelBubble: boolean = false;
    cancelable: boolean = false;
    composed: boolean = false;
    currentTarget: EventTarget | undefined;
    defaultPrevented: boolean = false;
    eventPhase: number = 0;
    isTrusted: boolean = false;
    returnValue: any;
    srcElement: Element | undefined;
    target: EventTarget | undefined;
    timeStamp: number = 0;
    composedPath: () => EventTarget[] = () => [];
    initEvent(_type: string, _bubbles: boolean, _cancelable: boolean) {

    }
    preventDefault() {
        this.defaultPrevented = true;
    }
    stopImmediatePropagation() {

    }
    stopPropogation() {

    }

    static NONE = 0;
    static CAPTURING_PHASE = 1;
    static AT_TARGET = 2;
    static BUBBLING_PHASE = 3;
}

global.ProgressEvent = EventPoly as any;

interface Abort {
    aborted: boolean;
}

class FileReaderPoly implements EventTarget {
    constructor() {
    }

    private _eventEmitter: EventEmitter = new EventEmitter();
    private _result: any = undefined;
    private _error: any = undefined;
    private _readyState: number = 0;
    private _cancel: Abort | undefined;

    public static readonly EMPTY: number = 0;
    public static readonly LOADING: number = 1;
    public static readonly DONE: number = 2;

    public get result() {
        return this._result;
    }

    public get error() {
        return this._error;
    }

    public get readyState() {
        return this._readyState;
    }

    private _read<T>(blob: Blob, callback: () => Promise<T>) {
        if (this.readyState === FileReaderPoly.LOADING) {
            throw 'Loading already';
        }

        try {
            this._result = undefined;
            this._error = undefined;
            this._readyState = FileReaderPoly.LOADING;

            const captured: Abort = { aborted: false };
            this._cancel = captured;

            const loadStartEvent = new ProgressEvent('loadstart', {});
            this.dispatchEvent(loadStartEvent);
            this.onloadstart?.(loadStartEvent);

            callback()
                .then(
                    result => {
                        if (captured.aborted) {
                            return;
                        }

                        this._readyState = FileReaderPoly.DONE;
                        this._result = result;
                        this._error = undefined;

                        const loadEvent: ProgressEvent = new ProgressEvent('load', {});
                        this.dispatchEvent(loadEvent);
                        this.onerror?.(loadEvent);

                        const loadEndEvent = new ProgressEvent('loadend', {});
                        this.dispatchEvent(loadEndEvent);
                        this.onloadend?.(loadEndEvent);
                    },
                    err => {
                        if (captured.aborted) {
                            return;
                        }

                        this._readyState = FileReaderPoly.DONE;
                        this._result = undefined;
                        this._error = err;

                        this._dispatchError();
                    }
                );
        }
        catch (err) {
            this._result = undefined;
            this._error = err;
            this._readyState = FileReaderPoly.DONE;

            this._dispatchError();
        }
    }

    private _dispatchError() {
        const errorEvent: ProgressEvent = new ProgressEvent('abort', {});
        this.dispatchEvent(errorEvent);
        this.onerror?.(errorEvent);

        const loadEndEvent = new ProgressEvent('loadend', {});
        this.dispatchEvent(loadEndEvent);
        this.onloadend?.(loadEndEvent);
    }

    readAsArrayBuffer(blob: Blob) {
        this._read(blob, () => blob.arrayBuffer());
    }

    readAsText(blob: Blob, encoding?: string) {
        this._read(
            blob,
            async () => {
                const buffer = await blob.arrayBuffer();
                return new TextDecoder(encoding).decode(buffer);
            }
        );
    }

    readAsBinaryString() {
        throw 'Not implemented';
    }

    readAsDataURL() {
        throw 'Not implemented';
    }

    abort() {
        if (this.readyState !== FileReaderPoly.LOADING) {
            return;
        }

        if (this._cancel) {
            this._cancel.aborted;
            this._cancel = undefined;
        }

        this._result = undefined;
        this._error = undefined;
        this._readyState = FileReaderPoly.DONE;

        const abortEvent: ProgressEvent = new ProgressEvent('abort', {});
        this.dispatchEvent(abortEvent);
        this.onabort?.(abortEvent);
    }

    dispatchEvent(evt: Event) {
        this._eventEmitter.emit(evt.type, evt);
        return true;
    }

    addEventListener(type: string, listener: EventListener) {
        this._eventEmitter.addListener(type, listener);
    }

    removeEventListener(type: string, listener: EventListener) {
        this._eventEmitter.removeListener(type, listener);
    }

    onerror: ((ev: ProgressEvent) => any) | undefined;
    onload: ((ev: ProgressEvent) => any) | undefined;
    onloadstart: ((ev: ProgressEvent) => any) | undefined;
    onloadend: ((ev: ProgressEvent) => any) | undefined;
    onabort: ((ev: ProgressEvent) => any) | undefined;
    onprogress: ((ev: ProgressEvent) => any) | undefined;
}

global.FileReader = FileReaderPoly as any;
*/
