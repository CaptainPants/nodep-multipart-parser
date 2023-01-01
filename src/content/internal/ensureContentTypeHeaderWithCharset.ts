import {
    ContentType,
    Header,
    Parameter,
    parseContentType,
    serializeContentType,
} from "../../headers/index.js";
import { arrayFind } from "../../internal/util/arrayFind";

export async function ensureContentTypeHeaderWithCharset(
    originalHeaders: Header[],
    defaultType: string,
    defaultSubtype: string,
    charset: string
): Promise<Header[]> {
    const contentTypeHeader = arrayFind(
        originalHeaders,
        (x) => x.lowerCaseName == "content-type"
    );

    if (contentTypeHeader) {
        const parsed = parseContentType(contentTypeHeader.value);
        const charsetParameterValue = arrayFind(
            parsed.parameters,
            (x) => x.lowerCaseName == "charset"
        )?.value;

        if (charsetParameterValue === charset) {
            return originalHeaders;
        }

        const newContentType: ContentType = {
            ...parsed,
            parameters: parsed.parameters
                .filter((x) => x.lowerCaseName != "charset")
                .concat(new Parameter("charset", charset)),
        };
        return originalHeaders
            .filter((x) => x.lowerCaseName != "content-type")
            .concat(
                new Header(
                    "Content-Type",
                    await serializeContentType(newContentType)
                )
            );
    } else {
        return originalHeaders.concat(
            new Header(
                "Content-Type",
                await serializeContentType({
                    type: defaultType,
                    subtype: defaultSubtype,
                    parameters: [new Parameter("charset", charset)],
                })
            )
        );
    }
}
