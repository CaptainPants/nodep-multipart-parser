import { expect, test, describe } from "@jest/globals";

import { blobToStringUsingFileReader } from "./blobToStringUsingFileReader.js";

test("test", async () => {
    const inputString =
        "The quick brown fox jumped over the lazy dog. Σὲ γνωρίζω ἀπὸ τὴν κόψη";

    // Blob constructor uses UTF-8
    const blob = new Blob([inputString]);

    const result = await blobToStringUsingFileReader(blob);

    expect(result).toStrictEqual(inputString);
});
