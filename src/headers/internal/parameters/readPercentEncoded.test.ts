import { describe, expect, test } from "@jest/globals";

import { HeaderParserState } from "../HeaderParserState.js";

import { readPercentEncoded } from "./readPercentEncoded.js";

test("readPercentEncoded", () => {
    expect(readPercentEncoded(new HeaderParserState("test"))).toEqual(
        undefined
    );
    expect(readPercentEncoded(new HeaderParserState("%C2%A3%20"))).toEqual(
        "£ "
    );
    expect(
        readPercentEncoded(new HeaderParserState("%20%E2%82%AC%20"))
    ).toEqual(" € ");
});
