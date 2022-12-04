import {
    Header,
    parseHeaders,
    parseContentType,
    isMultipartMediaType,
} from "../headers/index.js";
import { MultipartParser } from "../multipart/index.js";
import { Data, DataSource } from "../data/index.js";
import { arrayFind } from "../internal/util/arrayFind.js";

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

export class SingularHttpContent {
    constructor(public headers: Header[], public data: Data) {}

    static empty(): SingularHttpContent {
        return new SingularHttpContent([], Data.empty());
    }
}

export class MultipartHttpContent {
    constructor(
        public headers: Header[],
        public parts: SingularHttpContent[]
    ) {}
}

function getCharsetAndMediaType(
    headers: Header[]
): [
    mediaType: string | undefined,
    charset: string | undefined,
    boundary: string | undefined
] {
    const contentTypeRaw = arrayFind(
        headers,
        (x) => x.name.toLowerCase() == "content-type"
    )?.value;

    const contentType = contentTypeRaw
        ? parseContentType(contentTypeRaw)
        : undefined;

    if (!contentType) {
        return [undefined, undefined, undefined];
    }

    const lookup: Record<string, string> = {};
    contentType.parameters.forEach(
        (x) => (lookup[x.name.toLowerCase()] = x.value)
    );

    const charset = lookup["charset"];
    const boundary = lookup["boundary"];

    return [`${contentType.type}/${contentType.subtype}`, charset, boundary];
}
