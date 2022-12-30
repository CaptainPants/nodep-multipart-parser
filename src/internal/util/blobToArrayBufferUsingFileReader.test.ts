import { expect, test, describe } from "@jest/globals";

import { blobToArrayBufferUsingFileReader } from "./blobToArrayBufferUsingFileReader.js";

test("test", async () => {
    const inputString =
        "The quick brown fox jumped over the lazy dog. Σὲ γνωρίζω ἀπὸ τὴν κόψη";

    // Blob constructor uses UTF-8
    const blob = new Blob([inputString]);

    const result = await blobToArrayBufferUsingFileReader(blob);

    // TextDecoder uses UTF-8
    const decoded = new TextDecoder().decode(result);

    expect(decoded).toStrictEqual(inputString);
});
