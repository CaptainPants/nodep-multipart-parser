
import { TestEnvironment } from "jest-environment-jsdom";

import { Blob } from 'buffer';
import { TextEncoder, TextDecoder } from 'util';

export default class CustomEnvironment extends TestEnvironment {
    constructor(config, context) {
        config = Object.assign({}, config, {
            globals: Object.assign({}, config.globals, {
                // Not passing these in causes issues with instanceof
                //Uint32Array: Uint32Array,
                //Uint8Array: Uint8Array,
                //ArrayBuffer: ArrayBuffer,
                //Blob: Blob,

                // Not included in JSDOM
                TextEncoder: TextEncoder,
                TextDecoder: TextDecoder,
                TEST: 'CHEESE'
            })
        });

        super(config, context);
    }

    async setup() {
        await super.setup();
    }

    async teardown() {
        await super.teardown();
    }

}
