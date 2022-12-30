import { expect, test, describe } from "@jest/globals";

import { stringFind } from "./stringFind.js";

test("stringFind", () => {
    const data = "123";

    expect(stringFind(data, (x) => x === "1")).toEqual("1");
    expect(stringFind(data, (x) => x === "4")).toEqual(undefined);
});
