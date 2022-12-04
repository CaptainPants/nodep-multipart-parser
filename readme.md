# Zero-Dependency High-Compatibility Multipart HTTP Parser and Toolkit (Alpha)
See NPM package: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

The library provides a number of tools to make dealing with HTTP data simpler, including: HTTP requests with promises, multipart HTTP content as objects and the Data class that makes it easy to get between text and binary data structures. 

The project has two key goals:
- No runtime dependencies
- Compatibility with IE11

We hope to support as wide array of old browsers as possible, but in reality as a small open source project our testing resources are limited. As such our main compatibility goal is continued support for IE11 which will hopefully bring along with it other legacy browser versions. We will accept tickets for old browsers where possible and see if there is a practical was to implement support.

Where possible we will use newer browser features to provider better performance.

This is a small example showing these in action:

```typescript
import { HttpClient, MultipartHttpResponse } from '@captainpants/zerodeps-multipart-parser';

const client = new HttpClient();

const response = await client.request({
    method: 'GET',
    url: 'https://google.com',
    responseType: 'text' // or 'blob' or 'arraybuffer'
});

// now response is either a SingularHttpContaent or MultipartHttpContent, and you can check which with a simple instanceof check

if (response instanceof MultipartHttpResponse) {
    let i = 1;
    for (const part of response.parts) {
        console.log(`Part ${i}: ${await part.data.string()}`);

        ++i;
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
- https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd/zerodeps-multipart-parser.js
- And minified https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd/zerodeps-multipart-parser.min.js

# Components


This package includes several useful components:
* Easy to use interface to HTTP single part and multipart content via the [HttpContent](/doc/content.md) class.
* The underlying multipart parsing class [MultipartParser](/doc/multipart.md) which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Convenient conversion between **string**, **Blob**, **ArrayBuffer**, and **DataView** via the [Data](/doc/data.md) class. This class is similar to the modern **Response** class, but supports older browsers.
* Some [header utilities](/doc/headers.md) for dealing with raw headers, content-type and content-disposition headers (includind extended parameters).
* A light-weight [HttpClient](/doc/client.md) that brings a promise-based interface and more comprehensive interfaces to HTTP content over the top of XMLHttpRequest.
* Optional [polyfill](/doc/polyfills.md) for AbortController to support aborting Http requests for HttpClient. _We recommend considering using core-js if appropriate to your use case, ast these polyfills are only intended to fill functionality required for this library._
