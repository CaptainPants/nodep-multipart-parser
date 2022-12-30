import { test, expect } from "@jest/globals";

import { startsWith } from "./startsWith.js";

test("tests", () => {
    expect(startsWith("banana", "ban")).toStrictEqual(true);
    expect(startsWith("text/plain", "text/")).toStrictEqual(true);
    expect(startsWith("test", "long-prefix")).toStrictEqual(false);
});
