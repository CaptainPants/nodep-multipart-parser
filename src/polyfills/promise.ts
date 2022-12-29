
type AllResult<T extends readonly unknown[] | []> = { -readonly [P in keyof T]: Awaited<T[P]> };

export class PromisePolyfill<T> {
    private _state: 'pending' | 'resolved' | 'rejected' = 'pending';
    private _result: T | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _reason: any;

    private _fulfilledListeners: ((result: T) => void)[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _rejectedListeners: ((reason?: any) => void)[] = [];

    constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (resolve: (result: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
    ) {
        try {
            callback(
                result => this._resolve(result),
                reason => this._reject(reason)
            );
        }
        catch(err) {
            this._reject(err);
        }
    }
    
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ): PromisePolyfill<TResult1 | TResult2> {
        switch(this._state) {
            case "pending":
                return new PromisePolyfill<TResult1 | TResult2> (
                    (resolve, reject) => later(() => {
                        if (onfulfilled) this._fulfilledListeners.push(result => {
                            processResult(
                                () => onfulfilled(result),
                                resolve,
                                reject
                            );
                        });
                        if (onrejected) this._rejectedListeners.push(reason => {
                            processResult(
                                () => onrejected(reason),
                                resolve,
                                reject
                            );
                        });
                    })
                );

            case "rejected":
                return new PromisePolyfill(
                    (resolve, reject) => later(
                        () => {
                            reject(onrejected?.(this._reason) ?? this._reason);
                        }
                    )
                );

            case "resolved":
            {
                if (onfulfilled) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Checked by _reject/_resolve
                    const fulfilled = onfulfilled(this._result!);

                    if (isPromiseLike(fulfilled)) {
                        return new PromisePolyfill(
                            (resolve, reject) => later(() => {
                                fulfilled.then(resolve, reject);
                            })
                        );
                    }
                    else {
                        return new PromisePolyfill(
                            (resolve) => later(() => {
                                resolve(fulfilled);
                            })
                        );
                    }
                }
                else {
                    return new PromisePolyfill(
                        (resolve) => later(() => {
                            resolve(this._result as TResult1 | TResult2);
                        })
                    );
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _reject(reason?: any) {
        if (this._state !== "pending") return;
        this._state = "rejected";
        this._reason = reason;
    }

    private _resolve(result: T | PromiseLike<T>) {
        if (isPromiseLike<T>(result)) {
            result.then(
                innerResult => this._resolve(innerResult),
                innerReason => this._reject(innerReason)
            );
            return;
        }

        if (this._state !== "pending") return;
        this._state = "resolved";
        this._result = result;
    }

    public static resolve(): PromisePolyfill<void>;
    public static resolve<TResult>(result: TResult | PromiseLike<TResult>): PromisePolyfill<TResult>;
    public static resolve<TResult>(result?: TResult | PromiseLike<TResult> | undefined) {
        return new PromisePolyfill<TResult>(
            (resolve) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- resolve() needs to have an optional/undefined value
                resolve(result!);
            }
        );
    }

    public static reject<T = never>(reason?: unknown) {
        return new PromisePolyfill<T>(
            (_, reject) => {
                reject(reason);
            }
        );
    }

    public static race<T extends readonly unknown[] | []>(values: T): PromisePolyfill<Awaited<T[number]>>{
        return new PromisePolyfill<Awaited<T[number]>>(
            (resolve, reject) => {
                for (const value of values) {
                    if (isPromiseLike(value)) {
                        value.then(
                            result => resolve(result as Awaited<T[number]>), 
                            reason => reject(reason)
                        );
                    }
                    else {
                        resolve(value as Awaited<T[number]>);
                    }
                }
            }
        );
    }

    public static all<T extends readonly unknown[] | []>(values: T): PromisePolyfill<AllResult<T>> {
        return new PromisePolyfill(
            (resolve, reject) => {
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
                            result => {
                                results[capturedIndex] = result;
                                resolveOne();
                            },
                            reason => {
                                reject(reason);
                            }
                        );
                    }
                    else {
                        results[i] = value;
                        resolveOne();
                    }

                    ++i;
                }
            }
        );
    }
}

function isPromiseLike<T>(val: T | PromiseLike<T>): val is PromiseLike<T> {
    return typeof (val as { then: () => void }).then === 'function';
}

function later(callback: () => void) {
    return setTimeout(callback, 0);
}

function processResult<TResult>(
    func: () => TResult | PromiseLike<TResult>, 
    resolve: (result: TResult) => void, 
    reject: (reason?: unknown) => void
) {
    try{
        const result = func();
        if (isPromiseLike(result)) {
            result.then(resolve, reject);
        }
        else {
            resolve(result);
        }
        
    } catch(err) {
        reject(err);
    }
}