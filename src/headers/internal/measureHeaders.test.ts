import { describe, expect, test } from "@jest/globals";

import { Header } from "../Header.js";
import { measureHeaders } from "./measureHeaders.js";

test("basic", () => {
    const headers: Header[] = [
        // 12 + 2 + 10 + 2 = 26
        new Header("Content-Type", "text/plain"),
        // 14 + 2 + 3 + 2  = 21
        new Header("Content-Length", "100"),
    ];
    // +2 CRLF at the end = 49

    const result = measureHeaders(headers);

    expect(result).toEqual(49);
});
