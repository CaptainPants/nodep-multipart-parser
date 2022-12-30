import { expect, test, describe } from "@jest/globals";

import { AbortControllerPolyfill } from "./abort.js";

test("AbortControllerPolyfill", () => {
    const controller = new AbortControllerPolyfill();

    expect(controller.signal.aborted).toStrictEqual(false);

    controller.signal.throwIfAborted();

    controller.abort();

    expect(controller.signal.aborted).toStrictEqual(true);

    expect(() => {
        controller.signal.throwIfAborted();
    }).toThrowError(new DOMException("Aborted", "AbortError"));
});
