import { Parameter } from "../headers/Parameter.js";
import { parseContentType } from "../headers/parseContentType.js";
import { serializeContentType } from "../headers/serializeContentType.js";
import { ContentType } from "../headers/types.js";
import { arrayFind } from "../internal/util/arrayFind.js";
import { blobToArrayBufferUsingFileReader } from "../internal/util/blobToArrayBufferUsingFileReader.js";
import { blobToStringUsingFileReader } from "../internal/util/blobToStringUsingFileReader.js";
import { createBlob } from "../internal/util/createBlob.js";
import { expensiveCompatibleBlobSourceToString } from "../internal/util/expensiveCompatibleBlobSourceToString.js";
import { isArrayBuffer } from "../internal/util/isArrayBuffer.js";
import { stringToArrayBuffer } from "../internal/util/stringToArrayBuffer.js";

export type DataSource = string | ArrayBuffer | DataView | Blob | null;

export type BinaryResult<T extends Blob | DataView | ArrayBuffer> = {
    value: T;
    encoding: string | undefined;
};

/**
 * A generic container for data of either text or binary format, allowing easy conversion to the desire format for processing. In modern browsers this is similar
 * to the Response class. Note that any conversions from string to binary will be encoded using utf-8 as that is the only format guaranteed by standards for
 * TextEncoder and the Blob constructor.
 * as some conversion methods are asynchronous.
 * @param source The original source data to later be converted.
 * @param sourceEncoding The encoding used on string data stored in binary format.
 */
export class Data {
    constructor(
        public source: DataSource,
        public sourceEncoding?: string | undefined,
        public sourceMediaType?: string | undefined
    ) {
        if (
            !(
                typeof source === "string" ||
                source instanceof DataView ||
                isArrayBuffer(source) ||
                source instanceof Blob
            )
        ) {
            throw new TypeError(`Unexpected data type ${source}.`);
        }
    }

    /**
     * Creates an empty Data object, where the source is null and .isEmpty() returns true.
     * @returns
     */
    public static empty(): Data {
        return new Data(null);
    }

    private async _getBlobType(
        parameterContentType: string | undefined,
        parameterCharset?: string | undefined,
        defaultMediatType?: string | undefined
    ): Promise<string | undefined> {
        const contentTypeString = this.sourceMediaType ?? parameterContentType;

        // If no charset we don't need to modify the content-type
        // this also covers the case that both are undefined
        if (!parameterCharset) {
            return contentTypeString;
        }

        let contentType: ContentType;

        if (contentTypeString) {
            contentType = parseContentType(contentTypeString);
        } else {
            const [type, subtype] = (
                defaultMediatType ?? "application/octet-stream"
            ).split("/");
            contentType = {
                type: type,
                subtype: subtype,
                parameters: [],
            };
        }

        const charset = parameterCharset ?? this.sourceEncoding;

        if (charset) {
            let parameter = arrayFind(
                contentType.parameters,
                (item) => item.name === "charset"
            );
            if (parameter) {
                parameter.value = charset;
            } else {
                parameter = new Parameter("charset", charset);
                contentType.parameters.push(parameter);
            }
        }

        return await serializeContentType(contentType);
    }

    public isEmpty() {
        if (this.source === null) {
            return true;
        } else if (isArrayBuffer(this.source)) {
            return this.source.byteLength === 0;
        } else if (this.source instanceof Blob) {
            return this.source.size === 0;
        } else if (this.source instanceof DataView) {
            return this.source.byteLength;
        }
    }

    public string(): Promise<string> {
        if (this.source === null) {
            return Promise.resolve("");
        } else if (typeof this.source === "string") {
            return Promise.resolve(this.source);
        } else if (this.source instanceof Blob) {
            // Binary to binary retains source encoding
            return blobToStringUsingFileReader(
                this.source,
                this.sourceEncoding
            );
        } else {
            if (typeof TextDecoder !== "undefined") {
                return Promise.resolve(
                    new TextDecoder(this.sourceEncoding).decode(this.source)
                );
            } else {
                // Basically IE11 here
                return expensiveCompatibleBlobSourceToString(
                    this.source,
                    "utf-8"
                );
            }
        }
    }

    public async arrayBuffer(): Promise<BinaryResult<ArrayBuffer>> {
        if (isArrayBuffer(this.source)) {
            return { value: this.source, encoding: this.sourceEncoding };
        } else if (this.source instanceof DataView) {
            const target = new ArrayBuffer(this.source.byteLength);
            const targetTypedArray = new Uint8Array(target);
            targetTypedArray.set(
                new Uint8Array(
                    this.source.buffer,
                    this.source.byteOffset,
                    this.source.byteLength
                )
            );
            return { value: target, encoding: this.sourceEncoding };
        } else if (this.source instanceof Blob) {
            return {
                value: await blobToArrayBufferUsingFileReader(this.source),
                encoding: this.sourceEncoding,
            };
        } else if (this.source === null) {
            return { value: new ArrayBuffer(0), encoding: undefined };
        } else {
            // String path
            // Always utf-8 when converting from string to binary
            return {
                value: await stringToArrayBuffer(this.source),
                encoding: "utf-8",
            };
        }
    }

    /**
     * Note that if the source is already a blob the mediatype will not be updated.
     * @param contentType
     * @returns
     */
    public async blob(contentType?: string): Promise<BinaryResult<Blob>> {
        if (this.source === null) {
            return {
                value: new Blob([], {
                    // charset doesn't matter
                    type: contentType ?? this.sourceMediaType,
                }),
                encoding: undefined,
            };
        } else if (this.source instanceof Blob) {
            // Binary to binary retains source encoding
            return {
                value: this.source,
                encoding: this.sourceEncoding,
            };
        } else if (typeof this.source === "string") {
            // Blob constructor always converts to utf-8
            // https://developer.mozilla.org/en-US/docs/Web/API/Blob/Blob
            return {
                value: createBlob(
                    this.source,
                    await this._getBlobType(
                        contentType,
                        "utf-8",
                        "text/plain"
                    )
                ),
                encoding: "utf-8",
            };
        } else {
            // Binary to binary retains source encoding
            return {
                value: createBlob(
                    this.source,
                    await this._getBlobType(contentType)
                ),
                encoding: this.sourceEncoding,
            };
        }
    }

    public async dataView(): Promise<BinaryResult<DataView>> {
        if (this.source === null) {
            return {
                value: new DataView(new ArrayBuffer(0)),
                encoding: undefined,
            };
        } else if (isArrayBuffer(this.source)) {
            // binary to binary retains source encoding
            return {
                value: new DataView(this.source),
                encoding: this.sourceEncoding,
            };
        } else if (this.source instanceof DataView) {
            // binary to binary retains source encoding
            return { value: this.source, encoding: this.sourceEncoding };
        } else if (this.source instanceof Blob) {
            // binary to binary retains source encoding
            return {
                value: new DataView(
                    await blobToArrayBufferUsingFileReader(this.source)
                ),
                encoding: this.sourceEncoding,
            };
        } else {
            return {
                value: new DataView(await stringToArrayBuffer(this.source)),
                encoding: "utf-8",
            };
        }
    }

    public static async isSame(a: Data, b: Data): Promise<boolean> {
        if (typeof a.source === "string" || typeof b.source === "string") {
            return (await a.string()) == (await b.string());
        }

        if (a.binaryLength != b.binaryLength) return false;

        const aDataView = (await a.dataView()).value;
        const bDataView = (await b.dataView()).value;

        if (aDataView.byteLength != bDataView.byteLength) return false;

        for (let i = 0; i < aDataView.byteLength; ++i) {
            if (aDataView.getUint8(i) !== bDataView.getUint8(i)) {
                return false;
            }
        }

        return true;
    }

    public get binaryLength(): number | undefined {
        if (typeof this.source === "string") return undefined;

        if (this.source === null) return 0;
        if (this.source instanceof Blob) return this.source.size;
        if (isArrayBuffer(this.source)) return this.source.byteLength;
        if (this.source instanceof DataView) return this.source.byteLength;
    }
}
