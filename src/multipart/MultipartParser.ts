import { ParseError } from '..';
import { parseHeaders } from '../headers';
import { findBoundaryOffsets, getAsciiStringFromDataView, getCharCodesForString, isDoubleCRLF } from './internal';

// https://www.rfc-editor.org/rfc/rfc2046#section-5.1.7

export interface MultipartResult {
    parts: MultipartPart[];
}

export interface MultipartPart {
    headers: { name: string; value: string }[];
    content: DataView;
}

export class MultipartParser {
    parse(
        boundary: string,
        data: DataView
    ): MultipartResult {
        const parts: MultipartPart[] = [];

        // Get the equivelent ASCII values for the boundary string
        const boundaryCodes = getCharCodesForString(boundary);

        // Using the boundary string, break the data DataView into segments
        const partViews = findParts(boundaryCodes, data);

        for (let i = 0; i < partViews.length; ++i) {
            const current = partViews[i];

            // Each part has a header and a body, this splits them into a string for headers 
            // and a DataView for the body
            const { headers: headerString, content } = splitPartHeaderAndBody(current);

            const headersResult = parseHeaders({ headerString: headerString });

            parts.push({
                headers: headersResult.headers,
                content: content
            });
        }

        return {
            parts: parts
        };
    }
}

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

function findParts(boundaryCodes: number[], data: DataView): DataView[] {
    const boundaryOffsets = findBoundaryOffsets(boundaryCodes, data);

    if (boundaryOffsets.length == 0) {
        return [];
    }

    const partViews: DataView[] = [];

    for (let i = 1; i < boundaryOffsets.length; ++i) {
        const startOffset = boundaryOffsets[i - 1];
        const endOffset = boundaryOffsets[i];

        const start = startOffset.end;
        const end = endOffset.start;

        const len = end - start;

        const partView = new DataView(data.buffer, data.byteOffset + start, len);

        partViews.push(partView);
    }

    return partViews;
}

export const __testing = process.env.NODE_ENV == 'test' ? {
    splitPartHeaderAndBody,
    findParts
} : void 0;