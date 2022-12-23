import { Data, type DataSource } from "../data/Data.js";
import {
    type Header,
    isMultipartMediaType,
    parseHeaders,
} from "../headers/index.js";
import { MultipartParser } from "../multipart/MultipartParser.js";
import { getCharsetAndMediaType } from "./internal/getCharsetAndMediaType.js";
import { MultipartHttpContent } from "./MultipartHttpContent.js";
import { SingularHttpContent } from "./SingularHttpContent.js";

export type HttpContent = MultipartHttpContent | SingularHttpContent;

// eslint-disable-next-line @typescript-eslint/no-namespace -- having a namespace and type with matching names makes for a more ergonomic experience
export namespace HttpContent {
    export async function fromXHRResponse(
        xhr: XMLHttpRequest
    ): Promise<HttpContent> {
        const headers = parseHeaders({
            headerString: xhr.getAllResponseHeaders(),
        }).headers;

        let response: string | Blob | ArrayBuffer | null;
        if (xhr.responseType == "text") {
            response = xhr.responseText;
        } else {
            response = xhr.response;
        }

        return HttpContent.from(headers, response);
    }

    export async function from(
        headers: Header[],
        content: DataSource
    ): Promise<HttpContent> {
        const [charset, mediaType, boundary] = getCharsetAndMediaType(headers);

        const data = new Data(content, charset, mediaType);

        if (isMultipartMediaType(mediaType)) {
            const parser = new MultipartParser();

            if (!boundary) {
                throw new Error("No boundary found.");
            }

            const parsed = parser.parseDataView(
                boundary,
                (await data.dataView()).value
            );

            return new MultipartHttpContent(
                headers,
                parsed.parts.map((part) => {
                    const [partMediaType, partCharset] = getCharsetAndMediaType(
                        part.headers
                    );

                    return new SingularHttpContent(
                        part.headers,
                        new Data(part.content, partCharset, partMediaType)
                    );
                })
            );
        } else {
            return new SingularHttpContent(headers, data);
        }
    }
}
