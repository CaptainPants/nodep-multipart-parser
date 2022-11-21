import { ParseError } from '../ParseError.js';
import { parseHeaders, ContentType, ContentDisposition, parseContentType, parseContentDisposition } from '../headers/index.js';
import { findBoundarySeparatedParts, getAsciiStringFromDataView, getCharCodesForString, isDoubleCRLF } from './internal/index.js';

export interface MultipartResult {
    parts: MultipartPart[];
}

export interface MultipartPart {
    headers: { name: string; value: string }[];
    content: DataView;
    contentType: ContentType | undefined;
    contentDisposition: ContentDisposition | undefined;
}

/**
  * Parses a multipart body into usable segments.
  * https://www.rfc-editor.org/rfc/rfc2046#section-5.1.7
  */
export class MultipartParser {
    parseDataView(
        boundary: string,
        data: DataView
    ): MultipartResult {
        const parts: MultipartPart[] = [];

        // Get the equivelent ASCII values for the boundary string
        const boundaryCodes = getCharCodesForString(boundary);

        // Using the boundary string, break the data DataView into segments
        const partViews = findBoundarySeparatedParts(boundaryCodes, data);

        for (let i = 0; i < partViews.length; ++i) {
            const current = partViews[i];

            // Each part has a header and a body, this splits them into a string for headers 
            // and a DataView for the body
            const { headers: headerString, content } = splitPartHeaderAndBody(current);

            const headersResult = parseHeaders({ headerString: headerString });

            const contentTypeIndex = headersResult.headers.findIndex(x => x.name == 'content-type');
            const contentDispositionIndex = headersResult.headers.findIndex(x => x.name == 'content-disposition');

            const contentType = contentTypeIndex >= 0 ? parseContentType(headersResult.headers[contentTypeIndex].value)
                : undefined;
            const contentDisposition = contentDispositionIndex >= 0 ? parseContentDisposition(headersResult.headers[contentDispositionIndex].value)
                : undefined;

            parts.push({
                headers: headersResult.headers,
                content: content,
                contentType: contentType,
                contentDisposition: contentDisposition
            });
        }

        return {
            parts: parts
        };
    }
}

/**
  * Find the first double CRLF in the data view. The section before is the headers, the 
  * section after is the body. Converts the headers to string.
  */
function splitPartHeaderAndBody(dataview: DataView): { headers: string, content: DataView } {
    for (let i = 0; i < dataview.byteLength; ++i) {
        if (isDoubleCRLF(dataview, i)) {
            const headerPart = new DataView(
                dataview.buffer,
                dataview.byteOffset,
                i
            );

            const headerString = getAsciiStringFromDataView(headerPart);

            const startOfBodyPart = i + 4;
            const lengthOfBodyPart = dataview.byteLength - startOfBodyPart;

            const bodyPart = new DataView(
                dataview.buffer,
                dataview.byteOffset + startOfBodyPart,
                lengthOfBodyPart
            );

            return { headers: headerString, content: bodyPart };
        }
    }

    throw new ParseError('No CR LF CR LF sequence found');
}

export const __testing = process.env.NODE_ENV == 'test' ? {
    splitPartHeaderAndBody
} : void 0;