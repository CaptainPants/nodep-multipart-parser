type ErrorConstructorOnChrome = typeof Error & {
    captureStackTrace(self: unknown, constructor: new (...args: unknown[]) => unknown): void;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
// https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
// Borrowed some concepts from https://github.com/busbud/super-error/blob/master/index.js
// https://github.com/justmoon/extensible-error/blob/master/src/index.ts

function hasCaptureStackTrace(errorConstructor: typeof Error): errorConstructor is ErrorConstructorOnChrome {
    return typeof (errorConstructor as ErrorConstructorOnChrome).captureStackTrace === 'function';
}

// Make sure that ErrorBase looks like it extends Error when internally this is actually achieved by manually setting the prototype.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ParseError extends Error { }

export class ParseError {
    constructor(message?: string) {
        Error.call(this, message);

        // Set this.message
        Object.defineProperty(this, 'message', {
            configurable: true,
            enumerable: false,
            value: message !== undefined ? String(message) : ''
        });

        // Set this.name
        Object.defineProperty(this, 'name', {
            configurable: true,
            enumerable: false,
            value: this.constructor.name
        });

        if (hasCaptureStackTrace(Error)) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
// Extending 'Error' not supported on shittier browsers, so this makes instanceof work properly
Object.setPrototypeOf(ParseError.prototype, Error.prototype);