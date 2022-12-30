import { expect, test, describe } from "@jest/globals";

import { arrayRemoveWhere } from "./arrayRemoveWhere.js";

test("by value", () => {
    const list = [1, 2, 3, 4];

    const res = arrayRemoveWhere(list, (x) => x > 2);

    expect(list).toBe(res);

    expect(list).toStrictEqual([1, 2]);
});

test("by index", () => {
    const list = [1, 2, 3, 4];

    const res = arrayRemoveWhere(list, (x, index) => index == 2);

    expect(list).toBe(res);

    expect(list).toStrictEqual([1, 2, 4]);
});

test("none", () => {
    const list = [1, 2, 3, 4];

    const res = arrayRemoveWhere(list, (x, index) => false);

    expect(list).toBe(res);

    expect(list).toStrictEqual([1, 2, 3, 4]);
});

test("all", () => {
    const list = [1, 2, 3, 4];

    const res = arrayRemoveWhere(list, (x, index) => true);

    expect(list).toBe(res);

    expect(list).toStrictEqual([]);
});
