# A Zero-Dependency Multipart HTTP content parser
This package includes several useful components:
* Class **MultipartParser** which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Function **binaryToString** to convert content in a **DataView** or **ArrayBuffer** back to a string based on encoding provided in a content-type header. This is useful when you have mixed texted and binary content in a multipart container, or your content will sometimes be binary and sometimes be text (XMLHttpRequest forces you to declare responseType before making the call).
* Header processing utilities:
  * Function **parseHeaders** that can parse a header string like that returned from [XMLHttpRequest.getAllResponseHeaders()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders), or from a part withing multi-part content.
  * Function **getBoundary** to find the boundary string for use in parsing parts.
  * Functions **isTextMediaType** and **isTextContentType** for detecting if response content is text.
  * Functions **getEncoding** to extract encoding from a content-type header.


Example:
```typescript
import { MultipartParser } from 'nodep-multipart-parser';

const contentType = 'multipart/form-data; boundary="example-boundary-1251436436"';
const content: ArrayBuffer = ...;

const parser = new MultipartParser();
const boundary = parser.getBoundaryStringFromContentType(contentType);

const result = parser.parse(new DataView(content));

let i = 0;

for (const part of result.parts) {
    console.log('Part ', i, ' ', part);

    ++i;
}
```

In order to use this in the real world with an XMLHttpRequest, you will need to specify responseType to `'arraybuffer'`:

```typescript
const request = new XMLHttpRequest();
request.responseType = 'arraybuffer';

// send and wait for it to finish

const result: ArrayBuffer = request.response;
```

In some cases you might have an API that sometimes returns binary data and sometimes text, or a multipart response that has text and binary parts. To extract text from the binary part you can use the method **binaryToString**. This method uses **TextDecoder** on supported browsers, and falls back to **FileReader.readAsText** to support older browsers (IE10 hopefully according to https://caniuse.com/mdn-api_filereader_readastext).