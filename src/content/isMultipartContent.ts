import { HttpContent } from "./HttpContent.js";
import { MultipartHttpContent } from "./MultipartHttpContent.js";

export function isMultipartContent(
    content: HttpContent
): content is MultipartHttpContent {
    return Boolean((content as MultipartHttpContent).parts);
}
