# Zero-Dependency Multipart HTTP Content Parser (Alpha)
See NPM package: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

**This is alpha software**

We are mostly feature complete and API stable. There is also more work to be done on testing.

We bundle as an esm module with typescript bindings, and also a umd module:
- https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd/zerodeps-multipart-parser.js
- And minified https://unpkg.com/@captainpants/zerodeps-multipart-parser@latest/dist/umd/zerodeps-multipart-parser.min.js

----

A zero-dependency multipart HTTP content parser, with tools for conveniently switching between string and binary content. Supports back to Internet Explorer 11.

This package includes several useful components:
* Easy to use interface to HTTP single part and multipart content via the [HttpContent](./doc/content.md) class.
* The underlying multipart parsing class [MultipartParser](./doc/multipart.md) which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Convenient conversion between **string**, **Blob**, **ArrayBuffer**, and **DataView** via the [Data](./doc/data.md) class. This class is similar to the modern **Response** class, but supports older browsers.
* Some [header utilities](./doc/headers.md) for dealing with raw headers, content-type and content-disposition headers.
* A light-weight [HttpClient](./doc/client.md) that brings a promise-based interface and more comprehensive interfaces to HTTP content over the top of XMLHttpRequest.
* An optional polyfill for AbortController - which is required if you are on a browser that doesn't support them and you want to be able to abort HTTP requests (call **addPolyFills.AbortController()** to install it).

Using them all together:
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
