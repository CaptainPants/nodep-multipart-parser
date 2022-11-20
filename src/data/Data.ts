import { blobToArrayBuffer, blobToString, expensiveCompativalBlobSourceToString, stringToArrayBuffer } from "./internal";

export type DataSource = string | ArrayBuffer | DataView | Blob;

export type BinaryResult<T extends Blob | DataView | ArrayBuffer> = { value: T; encoding: string | undefined };

/**
  * A generic container for data of either text or binsry format, allowing easy conversion to the desire format for processing. In modern browsers this is similar
  * to the Response class.
  * as some conversion methods are asynchronous.
  * @param source The original source data to later be converted.
  * @param sourceEncoding The encoding used on string data stored in binary format.
  */
export class Data {
    constructor(
        public source: DataSource,
        public sourceEncoding: string | undefined
    ) {
        if (!(typeof source === 'string' || source instanceof DataView || source instanceof ArrayBuffer || source instanceof Blob)) {
            throw new TypeError(`Unexpected data type ${source}.`);
        }
    }

    public string(): Promise<string> {
        if (typeof this.source === 'string') {
            return Promise.resolve(this.source);
        }
        else if (this.source instanceof Blob) {
            return blobToString(this.source, this.sourceEncoding);
        }
        else {
            if (typeof TextDecoder !== 'undefined') {
                return Promise.resolve(new TextDecoder(this.sourceEncoding).decode(this.source));
            }
            else {
                // Basically IE11 here
                return expensiveCompativalBlobSourceToString(this.source, this.sourceEncoding);
            }
        }
    }

    public async arrayBuffer(): Promise<BinaryResult<ArrayBuffer>> {
        if (this.source instanceof ArrayBuffer) {
            return { value: this.source, encoding: this.sourceEncoding };
        }
        else if (this.source instanceof DataView) {
            const res = new ArrayBuffer(this.source.byteLength);
            new Uint8Array(res).set(new Uint8Array(this.source.buffer, this.source.byteOffset, this.source.byteLength));
            return { value: res, encoding: this.sourceEncoding };
        }
        else if (this.source instanceof Blob) {
            return { value: await blobToArrayBuffer(this.source), encoding: this.sourceEncoding };
        }
        else {
            return { value: await stringToArrayBuffer(this.source), encoding: 'utf-8' };
        }
    }

    public blob(): Promise<BinaryResult<Blob>> {
        if (this.source instanceof Blob) {
            return Promise.resolve({ value: this.source, encoding: this.sourceEncoding });
        }
        else if (typeof this.source === 'string') {
            Promise.resolve({ value: new Blob([this.source]), encoding: 'utf-8' });
        }
        return Promise.resolve({ value: new Blob([this.source]), encoding: this.sourceEncoding });
    }

    public async dataView(): Promise<BinaryResult<DataView>> {
        if (this.source instanceof ArrayBuffer) {
            return { value: new DataView(this.source), encoding: this.sourceEncoding };
        }
        else if (this.source instanceof DataView) {
            return { value: this.source, encoding: this.sourceEncoding };
        }
        else if (this.source instanceof Blob) {
            return { value: new DataView(await blobToArrayBuffer(this.source)), encoding: this.sourceEncoding };
        }
        else {
            return { value: new DataView(await stringToArrayBuffer(this.source)), encoding: 'utf-8' };
        }
    }
}