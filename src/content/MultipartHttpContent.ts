import { Data } from "../data/Data.js";
import { Header } from "../headers/index.js";
import { measureHeaders } from "../headers/internal/measureHeaders.js";
import { writeHeaders } from "../headers/internal/writeHeaders.js";
import { arrayFind } from "../internal/util/arrayFind.js";
import { writeStringToDataView } from "../internal/util/writeStringToDataView.js";
import { ensureContentTypeHeaderWithCharset } from "./internal/ensureContentTypeHeaderWithCharset.js";
import { getNameAndFilenameFromPart } from "./internal/getNameAndFilenameFromPart.js";
import { type SingularHttpContent } from "./SingularHttpContent.js";
export class MultipartHttpContent {
    constructor(
        public headers: Header[],
        public parts: SingularHttpContent[]
    ) {}

    /**
     * This is intended to mirror the FormData.entries() method.
     * IE11 doesn't support generators
     */
    public entries() {
        const res: {
            name: string;
            data: Data;
            filename: string | undefined;
        }[] = [];
        let partIndex = 0;

        for (const part of this.parts) {
            const { name, filename } = getNameAndFilenameFromPart(part);

            res.push({
                name: name ?? `part_${partIndex}`,
                data: part.data,
                filename: filename,
            });

            ++partIndex;
        }

        return res;
    }

    /**
     * Note that FormData doesn't support headers, so only the name and filename parameter
     * of a Content-Disposition header will be preserved. If the data you pass in isn't a
     * string or a blob, the Content-Type header will be used to provide a mediaType for
     * the intermediary blob.
     * @returns
     */
    public async toFormData(): Promise<FormData> {
        const res = new FormData();

        let i = 0;
        for (const part of this.parts) {
            const { name, filename } = getNameAndFilenameFromPart(part);

            let data: Blob | string;
            if (
                (typeof filename === "undefined" &&
                    typeof part.data.source === "string") ||
                part.data.source instanceof Blob
            ) {
                data = part.data.source;
            } else {
                const contentType = arrayFind(
                    part.headers,
                    (item) => item.lowerCaseName === "content-type"
                )?.value;

                // Not clear if its ok to pass content-type vs media-type/mime-type but
                // we want the charset parameter
                data = (await part.data.blob(contentType)).value;
            }

            const definedName = name ?? `part-${i}`;

            if (typeof filename === "undefined") {
                // Passing in a filename when its not a blob throws an error
                res.append(definedName, data);
            } else {
                res.append(definedName, data, filename);
            }

            ++i;
        }

        return res;
    }

    public async toArrayBuffer(boundary: string): Promise<ArrayBuffer> {
        const mapped: {
            content: DataView;
            headers: Header[];
            headersLength: number;
            bodyLength: number;
        }[] = [];

        for (const part of this.parts) {
            const { encoding: contentEncoding, value: content } =
                await part.data.dataView();

            const isText =
                typeof part.data.source === "string" ||
                typeof part.data.sourceEncoding !== "undefined";

            const [type, subtype] =
                part.data.sourceMediaType?.split("/") ??
                (isText ? ["text", "plain"] : ["application", "x-unknown"]);

            let headers = part.headers;

            // inject charset into a content-type header
            if (contentEncoding) {
                headers = await ensureContentTypeHeaderWithCharset(
                    headers,
                    type,
                    subtype,
                    contentEncoding
                );
            }

            // headers length includes the extra CRLF at the end of the headers
            const headersLength = measureHeaders(headers);

            mapped.push({
                content: content,
                headers: headers,
                headersLength: headersLength,
                bodyLength: content.byteLength,
            });
        }

        // Then a boundary before each part, each with a preceding -- (x2) and a trailing \r\n (x2)
        // Each part ends with a \r\n (x2)
        // And then a special boundary after the last part with a -- instead (which is also x2 chars)
        const boundaryTotalLength =
            (2 /* -- */ + boundary.length + 2 + 2) * this.parts.length +
            (2 + boundary.length + 2);

        const partContentLength = mapped.reduce(
            (previousValue, item) =>
                previousValue + item.headersLength + item.bodyLength,
            0
        );

        const totalLength = boundaryTotalLength + partContentLength;

        const buffer = new ArrayBuffer(totalLength);
        const view = new DataView(buffer);
        const typedArray = new Uint8Array(buffer);

        let offset = 0;

        for (const part of mapped) {
            offset += writeStringToDataView(
                "--" + boundary + "\r\n",
                view,
                offset
            );

            // Includes the extra \r\n at the end of the headers
            offset += writeHeaders(part.headers, view, offset);

            // Uint8Array.set bulk copies the data
            typedArray.set(
                new Uint8Array(
                    part.content.buffer,
                    part.content.byteOffset,
                    part.content.byteLength
                ),
                offset
            );
            offset += part.content.byteLength;

            offset += writeStringToDataView("\r\n", view, offset);
        }

        const lastBoundary = "--" + boundary + "--";
        offset += writeStringToDataView(lastBoundary, view, offset);

        return buffer;
    }
}
