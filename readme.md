# Zero-Dependency High-Compatibility Multipart HTTP Parser and Toolkit (Beta)
See NPM package: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

This project's focus is a parser for multi-part HTTP content coming from XMLHttpRequest responses.

Project goals:
- Make it easy to parse multi-part HTTP responses
- No runtime dependencies
- Compatibility with IE11

As a natural progression from this, this library also provides a number of tools to make dealing with HTTP data simpler, including: 
* Easy to use interface to HTTP single part and multipart content via the [HttpContent](doc/content.md) class.
* The multipart parsing class [MultipartParser](doc/multipart.md) which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Convenient conversion between **string**, **Blob**, **ArrayBuffer**, and **DataView** via the [Data](doc/data.md) class. This class is similar to the modern **Response** class, but supports older browsers.
* Some [header utilities](doc/headers.md) for dealing with raw headers, content-type and content-disposition headers (including extended parameters).
* A light-weight [HttpClient](doc/httpclient.md) that brings a promise-based interface and more comprehensive interfaces to HTTP content over the top of XMLHttpRequest.

Some modern browser functionality has been [polyfilled](doc/polyfills.md) to support IE11. You may opt to use core-js or similar more fully feature (and tested) polyfill packages instead of the ones bundled.

* Promises - Required to use the library with IE11
* AbortController - (Optional) Required to support aborting Http requests for HttpClient in IE11.


We hope to support as wide array of old browsers as possible, but in reality as a small open source project our testing resources are limited. As such our main compatibility goal is continued support for IE11 which will hopefully bring along with it other legacy browser versions. We will accept tickets for old browsers where possible and see if there is a practical was to implement support.

Where possible we will use newer browser features to provider better performance.

This is a small example showing the library in action:

```typescript
import { HttpClient, isMultipartContent, MultipartHttpResponse } from '@captainpants/zerodeps-multipart-parser';

const client = new HttpClient();

const response = await client.request({
    method: 'GET',
    url: 'https://google.com',
    responseType: 'arraybuffer' // 'text' or 'blob' or 'arraybuffer'
});

// now response is either a SingularHttpContent or MultipartHttpContent, and you can check which with a simple instanceof check, or check for the presence of the 'parts' property

if (isMultipartContent(response)) { // or response instanceof MultipartHttpResponse
    let i = 1;
    for (const part of response.parts) {
        console.log(`Part ${i}: ${await part.data.string()}`);

        ++i;
    }

    // alternatively 
    for (const { name, filename, data } of response.entries()) {
        // The entries method is modelled on the structure of FormData.prototype.entries()
    }
}
else {
    // otherwise its a SingularHttpResponse
}
```

# Packaging

We bundle as an esm module with typescript bindings, and also a umd module.

You can find us on npm: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

To use our umd module you can access it from unpkg:
- https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd.js
- And minified https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd.min.js
