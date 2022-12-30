import { expect, test, describe } from "@jest/globals";

import { PromisePolyfill } from "./promise.js";

test("resolved", async () => {
    const result = await PromisePolyfill.resolve(1);

    expect(result).toEqual(1);
});

test("rejected", async () => {
    await expect(
        PromisePolyfill.reject(new Error("test"))
    ).rejects.toHaveProperty("message", "test");
});

describe("chained", () => {
    test("test1", async () => {
        const promise = PromisePolyfill.reject(new Error("test 1"))
            .then(undefined, undefined)
            .then(undefined, (reason) => {
                throw new Error("test 2");
            });
        await expect(promise).rejects.toHaveProperty("message", "test 2");
    });
});

describe("all", () => {
    test("all resolved", async () => {
        const promise = PromisePolyfill.all([
            PromisePolyfill.resolve(1),
            PromisePolyfill.resolve(2),
            PromisePolyfill.resolve(3),
        ]);
        await expect(promise).resolves.toEqual([1, 2, 3]);
    });

    test("one rejects", async () => {
        const promise = PromisePolyfill.all([
            PromisePolyfill.resolve(1),
            PromisePolyfill.resolve(2),
            PromisePolyfill.reject(3),
        ]);
        await expect(promise).rejects.toEqual(3);
    });
});
