import { test, expect } from "@jest/globals";

import { isArrayBuffer } from "./index.js";

test("tests", () => {
    const arrayBuffer = new ArrayBuffer(100);
    const dataView = new DataView(arrayBuffer);
    const typedArray = new Uint8Array(arrayBuffer);

    expect(isArrayBuffer(arrayBuffer)).toBe(true);
    expect(isArrayBuffer(dataView)).toBe(false);
    expect(isArrayBuffer(typedArray)).toBe(false);
    expect(isArrayBuffer([1, 2, 3])).toBe(false);
});
