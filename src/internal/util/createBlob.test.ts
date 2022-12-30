import { expect, test, describe } from "@jest/globals";
import { blobToArrayBufferUsingFileReader } from "./blobToArrayBufferUsingFileReader.js";

import { createBlob } from "./createBlob.js";

test("test1", async () => {
    const list = [1, 2, 3, 4];
    const arrayBuffer = new ArrayBuffer(4);
    const typed = new Uint8Array(arrayBuffer);
    typed.set(list, 0);

    const blob = createBlob(new DataView(arrayBuffer));

    const returned = await blobToArrayBufferUsingFileReader(blob);

    expect(arrayBuffer).toStrictEqual(returned);
});
