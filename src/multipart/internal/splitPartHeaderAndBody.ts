import { ParseError } from "../../errors/ParseError.js";
import { getAsciiStringFromDataView, isDoubleCRLF } from "./util.js";

/**
 * Find the first double CRLF in the data view. The section before is the headers, the
 * section after is the body. Converts the headers to string.
 */
export function splitPartHeaderAndBody(dataview: DataView): {
    headers: string;
    content: DataView;
} {
    for (let i = 0; i < dataview.byteLength; ++i) {
        if (isDoubleCRLF(dataview, i)) {
            const startOfBodyPart = i + 4;

            const headerPart = new DataView(
                dataview.buffer,
                dataview.byteOffset,
                startOfBodyPart
            );

            const headerString = getAsciiStringFromDataView(headerPart);

            const lengthOfBodyPart = dataview.byteLength - startOfBodyPart;

            const bodyPart = new DataView(
                dataview.buffer,
                dataview.byteOffset + startOfBodyPart,
                lengthOfBodyPart
            );

            return { headers: headerString, content: bodyPart };
        }
    }

    throw new ParseError("No CR LF CR LF sequence found");
}
