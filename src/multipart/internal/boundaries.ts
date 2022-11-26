import { isCRLF, isDoubleHyphen } from "./util.js";
import { ParseError } from "../../errors/index.js";

/**
  * Search for each instance of the boundary sequence.
  */
export function findBoundarySeparatedParts(boundaryCodes: number[], data: DataView): DataView[] {
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

export interface Boundary {
    start: number;
    end: number;
    length: number;
    isLast: boolean;
}


/**
  * https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1
  * > The Content-Type field for multipart entities requires one parameter,
  * > "boundary". The boundary delimiter line is then defined as a line
  * > consisting entirely of two hyphen characters ("-", decimal value 45)
  * > followed by the boundary parameter value from the Content-Type header
  * > field, optional linear whitespace, and a terminating CRLF.
  */
export function findBoundaryOffsets(boundary: number[], data: DataView): Boundary[] {
    if (boundary.length <= 0) {
        throw new ParseError(`Boundary length of 0 is not supported.`);
    }

    const res: Boundary[] = [];

    // TODO: if we hit the end and we're not on a last boundary,
    // or if we hit a last boundary and its not the end..
    for (let i = 0; i < data.byteLength;) {
        const matched = matchBoundary(boundary, data, i);

        if (matched) {
            res.push(matched);
            i += matched.length;
        }
        else {
            ++i;
        }
    }

    return res;
}

export function matchBoundary(boundary: number[], data: DataView, dataOffset: number): Boundary | undefined {
    if (dataOffset >= data.byteLength) {
        throw new ParseError('dataOffset past end of DataView.');
    }

    const start = dataOffset;

    // expected CR LF
    if (!isCRLF(data, dataOffset)) {
        return undefined;
    }

    // expecting '-' '-'
    if (!isDoubleHyphen(data, dataOffset + 2)) {
        return undefined;
    }

    // CR LF '-' '-'
    dataOffset += 4;

    for (let i = 0; i < boundary.length; ++i) {
        if (i >= data.byteLength) {
            return undefined; // we've hit the end of the data
        }

        if (boundary[i] !== data.getUint8(dataOffset + i)) {
            return undefined; // does not match boundary
        }
    }

    dataOffset += boundary.length;

    let isLast: boolean;

    if (isDoubleHyphen(data, dataOffset)) {
        isLast = true;
        dataOffset += 2;

        if (dataOffset + 2 !== data.byteLength) {
            // This means we've hit the last boundary
            // TODO: not sure what we're supposed to do
        }
    }
    else {
        isLast = false;

        if (isCRLF(data, dataOffset)) {
            dataOffset += 2;
        }
        else {
            // According to https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1
            // Any content after the boundary on a line should be ignored.
            throw new Error('TODO: we should consume to the next CRLF here');
        }
    }

    return {
        start: start,
        end: dataOffset,
        length: dataOffset - start,
        isLast: isLast
    };
}