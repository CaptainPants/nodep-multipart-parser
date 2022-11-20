
import { ContentType, ContentDisposition, Header, parseHeaders, parseContentType, parseContentDisposition, isMultipartMediaType } from './headers';
import { MultipartParser } from './multipart';
import { Data, DataSource } from './data';

export abstract class HttpContent {
    constructor(
        public headers: Header[],
        public contentType: ContentType | undefined,
        public contentDisposition: ContentDisposition | undefined
    ) {
    }

    static async fromXHRResponse(xhr: XMLHttpRequest): Promise<HttpContent> {
        const headers = parseHeaders({
            headerString: xhr.getAllResponseHeaders()
        }).headers;

        return HttpContent.from(headers, xhr.response);
    }

    static async from(headers: Header[], content: DataSource) {

        const contentTypeIndex = headers.findIndex(x => x.name === 'content-type');
        const contentDispositionIndex = headers.findIndex(x => x.name === 'content-disposition');

        const contentType = contentTypeIndex >= 0 ?
            parseContentType(headers[contentTypeIndex].value) :
            undefined;
        const contentDisposition = contentDispositionIndex >= 0 ?
            parseContentDisposition(headers[contentDispositionIndex].value) :
            undefined;

        const data = new Data(content, contentType?.charset);

        if (isMultipartMediaType(contentType?.mediaType)) {
            const parser = new MultipartParser();
            const boundary = contentType?.boundary;
            if (boundary === undefined) {
                throw new Error('No boundary found.');
            }

            const parsed = parser.parseDataView(boundary, (await data.dataView()).value);

            return new MultipartHttpContent(
                headers,
                contentType,
                contentDisposition,
                parsed.parts.map(x => {
                    return new SingularHttpContent(
                        x.headers,
                        x.contentType,
                        x.contentDisposition,
                        new Data(x.content, x.contentType?.mediaType)
                    );
                })
            );
        }
        else {
            return new SingularHttpContent(
                headers,
                contentType,
                contentDisposition,
                data
            );
        }
    }
}

export class SingularHttpContent extends HttpContent {
    constructor(
        headers: Header[],
        contentType: ContentType | undefined,
        contentDisposition: ContentDisposition | undefined,
        public data: Data
    ) {
        super(headers, contentType, contentDisposition);
    }
}

export class MultipartHttpContent extends HttpContent {
    constructor(
        headers: Header[],
        contentType: ContentType | undefined,
        contentDisposition: ContentDisposition | undefined,
        public parts: SingularHttpContent[]
    ) {
        super(headers, contentType, contentDisposition);
    }
}