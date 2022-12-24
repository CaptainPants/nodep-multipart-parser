import { ContentType, parseContentType, serializeContentType, type Header } from "../headers/index.js";
import { measureHeaders } from "../headers/internal/measureHeaders.js";
import { writeHeaders } from "../headers/internal/writeHeaders.js";
import { arrayFind } from "../internal/util/arrayFind.js";
import { writeStringToDataView } from "../internal/util/writeStringToDataView.js";
import { type HttpContent } from "./HttpContent.js";
import { type SingularHttpContent } from "./SingularHttpContent.js";

export function isMultipartContent(
    content: HttpContent
): content is MultipartHttpContent {
    return Boolean((content as MultipartHttpContent).parts);
}

export class MultipartHttpContent {
    constructor(
        public headers: Header[],
        public parts: SingularHttpContent[]
    ) {}

    public async toArrayBuffer(boundary: string): Promise<ArrayBuffer> {
        const mapped: { content: DataView, headers: Header[], headersLength: number, bodyLength: number }[] = [];

        for(const part of this.parts) {
            const content = await part.data.dataView();
            const [type, subtype] = (part.data.sourceMediaType?.split('/') ?? ['text', 'plain']); // TODO: not sure if text/plain is a sensible default, but oh well

            let headers = part.headers;

            // inject charset into a content-type header
            if (content.encoding) {
                headers = await ensureContentTypeHeaderWithCharset(headers, type, subtype, content.encoding);
            }
            
            // headers length includes the extra CRLF at the end of the headers
            const headersLength = measureHeaders(headers);

            mapped.push({
                content: content.value,
                headers: headers,
                headersLength: headersLength,
                bodyLength: content.value.byteLength
            });
        }

        // Then a boundary before each part, each with a preceding -- (x2) and a trailing \r\n (x2)
        // Each part ends with a \r\n (x2)
        // And then a special boundary after the last part with a -- instead (which is also x2 chars)
        const boundaryTotalLength = ((2 + boundary.length + 2 + 2) * (this.parts.length)) + (boundary.length + 2);

        const partContentLength = mapped.reduce((previousValue, item) => previousValue + item.headersLength + item.bodyLength, 0);

        const totalLength = boundaryTotalLength + partContentLength;

        const buffer = new ArrayBuffer(totalLength);
        const view = new DataView(buffer);
        const typedArray = new Uint8Array(buffer);

        let offset = 0;

        for (const part of mapped) {
            offset += writeStringToDataView('--' + boundary + '\r\n', view, offset);

            // Includes the extra \r\n at the end of the headers
            offset += writeHeaders(part.headers, view, offset);

            // Uint8Array.set bulk copies the data
            typedArray.set(new Uint8Array(part.content.buffer, part.content.byteOffset, part.content.byteLength), offset);
            offset += part.content.byteLength;

            offset += writeStringToDataView('\r\n', view, offset);
        }
        
        const lastBoundary = '--' + boundary + '--';
        offset += writeStringToDataView(lastBoundary, view, offset);

        return buffer;
    }
}

async function ensureContentTypeHeaderWithCharset(originalHeaders: Header[], defaultType: string, defaultSubtype: string, charset: string): Promise<Header[]> {
    const contentTypeHeader = arrayFind(originalHeaders, x => x.name == 'content-type');

    if (contentTypeHeader) {
        const parsed = parseContentType(contentTypeHeader.value);
        const charsetParameterValue = arrayFind(parsed.parameters, x => x.name == 'charset')?.value;

        if (charsetParameterValue === charset) {
            return originalHeaders;
        }

        const newContentType: ContentType = {
            ...parsed,
            parameters: parsed.parameters.filter(x => x.name != 'charset').concat({ name: 'charset', value: charset })
        };
        return  originalHeaders.filter(x => x.name != 'content-type').concat({ name: 'content-type', value: await serializeContentType(newContentType) });
    }
    else {
        return originalHeaders.concat({
            name: 'content-type',
            value: await serializeContentType({ type: defaultType, subtype: defaultSubtype, parameters: [{ name: 'charset', value: charset }] })
        });
    }
}