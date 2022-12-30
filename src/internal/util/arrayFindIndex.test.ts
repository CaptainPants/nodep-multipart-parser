import { expect, test, describe } from "@jest/globals";

import { arrayFindIndex } from "./arrayFindIndex.js";

test("arrayFind", () => {
    const data = [1, 2, 3];

    expect(arrayFindIndex(data, (x) => x === 1)).toEqual(0);
    expect(arrayFindIndex(data, (x) => x === 4)).toEqual(-1);
});
