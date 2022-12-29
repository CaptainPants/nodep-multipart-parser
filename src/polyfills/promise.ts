type AllResult<T extends readonly unknown[] | []> = {
    -readonly [P in keyof T]: Awaited<T[P]>;
};

export class PromisePolyfill<T> {
    private _state:
        | { label: "pending" }
        | { label: "resolved"; result: T }
        | { label: "rejected"; reason: unknown } = { label: "pending" };

    private _fulfilledListeners: ((result: T) => void)[] = [];
    private _rejectedListeners: ((reason?: unknown) => void)[] = [];

    constructor(
        callback: (
            resolve: (result: T | PromiseLike<T>) => void,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reject: (reason?: any) => void
        ) => void
    ) {
        try {
            callback(
                (result) => this._resolve(result),
                (reason) => this._reject(reason)
            );
        } catch (err) {
            this._reject(err);
        }
    }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?:
            | ((value: T) => TResult1 | PromiseLike<TResult1>)
            | null
            | undefined,
        onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromisePolyfill<TResult1 | TResult2> {
        switch (this._state.label) {
            case "pending":
                return new PromisePolyfill<TResult1 | TResult2>(
                    (resolve, reject) => {
                        if (onfulfilled) {
                            this._fulfilledListeners.push((result) => {
                                processResult(
                                    () => onfulfilled(result),
                                    resolve,
                                    reject
                                );
                            });
                        }
                        if (onrejected) {
                            this._rejectedListeners.push((reason) => {
                                processResult(
                                    () => onrejected(reason),
                                    resolve,
                                    reject
                                );
                            });
                        }
                    }
                );

            case "rejected": {
                const state = this._state;
                return new PromisePolyfill((resolve, reject) =>
                    later(() => {
                        reject(onrejected?.(state.reason) ?? state.reason);
                    })
                );
            }

            case "resolved": {
                const state = this._state;
                if (onfulfilled) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Checked by _reject/_resolve
                    const fulfilled = onfulfilled(state.result!);

                    if (isPromiseLike(fulfilled)) {
                        return new PromisePolyfill((resolve, reject) =>
                            later(() => {
                                fulfilled.then(resolve, reject);
                            })
                        );
                    } else {
                        return new PromisePolyfill((resolve) =>
                            later(() => {
                                resolve(fulfilled);
                            })
                        );
                    }
                } else {
                    return new PromisePolyfill((resolve) =>
                        later(() => {
                            resolve(state.result as TResult1 | TResult2);
                        })
                    );
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _reject(reason?: any) {
        if (this._state.label !== "pending") return;
        this._state = {
            label: "rejected",
            reason: reason,
        };

        for (const listener of this._rejectedListeners) {
            listener(reason);
        }
    }

    private _resolve(result: T | PromiseLike<T>) {
        if (isPromiseLike<T>(result)) {
            result.then(
                (innerResult) => this._resolve(innerResult),
                (innerReason) => this._reject(innerReason)
            );
            return;
        }

        if (this._state.label !== "pending") return;
        this._state = {
            label: "resolved",
            result: result,
        };

        for (const listener of this._fulfilledListeners) {
            listener(result);
        }
    }

    public static resolve(): PromisePolyfill<void>;
    public static resolve<TResult>(
        result: TResult | PromiseLike<TResult>
    ): PromisePolyfill<TResult>;
    public static resolve<TResult>(
        result?: TResult | PromiseLike<TResult> | undefined
    ) {
        return new PromisePolyfill<TResult>((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- resolve() needs to have an optional/undefined value
            resolve(result!);
        });
    }

    public static reject<T = never>(reason?: unknown) {
        return new PromisePolyfill<T>((_, reject) => {
            reject(reason);
        });
    }

    public static race<T extends readonly unknown[] | []>(
        values: T
    ): PromisePolyfill<Awaited<T[number]>> {
        return new PromisePolyfill<Awaited<T[number]>>((resolve, reject) => {
            for (const value of values) {
                if (isPromiseLike(value)) {
                    value.then(
                        (result) => resolve(result as Awaited<T[number]>),
                        (reason) => reject(reason)
                    );
                } else {
                    resolve(value as Awaited<T[number]>);
                }
            }
        });
    }

    public static all<T extends readonly unknown[] | []>(
        values: T
    ): PromisePolyfill<AllResult<T>> {
        return new PromisePolyfill((resolve, reject) => {
            const numberAwaited = values.length;
            let numberResolved = 0;
            const results: unknown[] = [];

            function resolveOne() {
                numberResolved += 1;
                if (numberResolved == numberAwaited) {
                    resolve(results as AllResult<T>);
                }
            }

            let i = 0;
            for (const value of values) {
                const capturedIndex = i;
                if (isPromiseLike(value)) {
                    value.then(
                        (result) => {
                            results[capturedIndex] = result;
                            resolveOne();
                        },
                        (reason) => {
                            reject(reason);
                        }
                    );
                } else {
                    results[i] = value;
                    resolveOne();
                }

                ++i;
            }
        });
    }
}

function isPromiseLike<T>(val: T | PromiseLike<T>): val is PromiseLike<T> {
    return val && typeof (val as { then: () => void }).then === "function";
}

function later(callback: () => void) {
    return setTimeout(callback, 0);
}

function processResult<TResult>(
    func: () => TResult | PromiseLike<TResult>,
    resolve: (result: TResult) => void,
    reject: (reason?: unknown) => void
) {
    try {
        const result = func();
        if (isPromiseLike(result)) {
            result.then(resolve, reject);
        } else {
            resolve(result);
        }
    } catch (err) {
        reject(err);
    }
}
