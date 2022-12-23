import { parseHeaders } from "../headers/index.js";
import {
    findBoundarySeparatedParts,
    getCharCodesForString,
} from "./internal/index.js";
import { splitPartHeaderAndBody } from "./internal/splitPartHeaderAndBody.js";

export interface MultipartResult {
    parts: MultipartPart[];
}

export interface MultipartPart {
    headers: { name: string; value: string }[];
    content: DataView;
}

/**
 * Parses a multipart body into usable segments.
 * https://www.rfc-editor.org/rfc/rfc2046#section-5.1.7
 */
export class MultipartParser {
    parseDataView(boundary: string, data: DataView): MultipartResult {
        const parts: MultipartPart[] = [];

        // Get the equivelent ASCII values for the boundary string
        const boundaryCodes = getCharCodesForString(boundary);

        // Using the boundary string, break the data DataView into segments
        const partViews = findBoundarySeparatedParts(boundaryCodes, data);

        for (let i = 0; i < partViews.length; ++i) {
            const current = partViews[i];

            // Each part has a header and a body, this splits them into a string for headers
            // and a DataView for the body
            const { headers: headerString, content } =
                splitPartHeaderAndBody(current);

            const headersResult = parseHeaders({ headerString: headerString });

            parts.push({
                headers: headersResult.headers,
                content: content,
            });
        }

        return {
            parts: parts,
        };
    }
}
