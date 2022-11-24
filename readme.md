# Zero-Dependency Multipart HTTP content parser (Alpha)
See NPM package: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

**This is alpha software - feel free to try it, but it is buggy and subject to change.**

----

A Zero-dependency multipart HTTP content parser, with tools for conveniently switching between string and binary content. Supports back to Internet Explorer 11.

This package includes several useful components:
* Class **MultipartParser** which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Simple interface to HTTP single part and multipart content via the **HttpContent** class.
* Simple conversion between `string | Blob | ArrayBuffer | DataView` via the **Data** class. This class is similar to the modern **Response** class, but supports older browsers.
* Header processing utilities:
  * Function **parseHeaders** that can parse a header string like that returned from [XMLHttpRequest.getAllResponseHeaders()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders), or from a part withing multi-part content.
  * Function **parseContentType** and **parseContentDisposition** to extract components of the Content-Type and Content-Disposition headers (charset, boundary, name and filename).
  * Functions **isTextMediaType** and **isMultipartMediaType** for detecting if response content is text or multipart respectively.

Use HttpContent to get simplified access to XMLHttpResponse responses that may be multipart:
```typescript
import { HttpContent, MultipartHttpContent, SingularHttpContent } from '@captainpants/zerodeps-multipart-parser';

const xhr = new XMLHttpRequest();
// To handle multipart responses you will need to specify responseType = 'arraybuffer'
xhr.responseType = 'arraybuffer';

req.addEventListener("load", reqListener);
req.open("GET", "http://www.example.org/example.txt");
req.send();

async function reqListener() {
    // run the XML request and wait for result
    const content = HttpContent.fromXHRResponse(xhr);

    if (content instanceof MultipartHttpContent) {
        // This is multipart content
        for (const part of content.parts) {
            /*
            Do something with the parts here.
            Each part is a SingularHttpContent with a data (of type Data) property, 
            which internally is a DataView to the bytes of that segment.
            */
            const asString = await content.data.string();
        }
    }
    else {
        // Singular content

        // get content as a string
        const asString = await content.data.string(); 
        // or in a binary format
        const asBinary1 = await content.data.arrayBuffer();
        const asBinary2 = await content.data.blob();
        const asBinary3 = await content.data.dataView();
    }
}
```

Using the multipart parser directly:
```typescript
import { MultipartParser, parseContentType } from 'nodep-multipart-parser';

const contentType = parseContentType('multipart/form-data; boundary="example-boundary-1251436436"');
const content: ArrayBuffer = ...;

if (!contentType.boundary) {
    throw new Error('No boundary provided.');
}

const parser = new MultipartParser();
const result = parser.parseDataView(contentType.boundary, new DataView(content));

let i = 0;

for (const part of result.parts) {
    console.log('Part ', i, ' ', part);

    ++i;
}
```

The **Data** class lets you conveniently switch data between binary structures and back and forth with string. For string to binary conversion we use TextEncoder/TextDecoder, falling back to FileReader/Blob constructor for IE11 and other browsers (Hopefully IE10 too according to https://caniuse.com/mdn-api_filereader_readastext). Functions that give a binary result also include the text encoding if relevant (if converting from string or if the data was already binary encoded text with a known encoding).
```typescript
const data1 = new Data('Cheesecake');
const asArrayBuffer1 = await data1.arrayBuffer();
const asBlob1 = await data1.blob();
const asDataView1 = await data1.dataView();

const data2 = new Data(asArrayBuffer1.value, asArrayBuffer1.encoding);
const asString2 = await data2.string();
```