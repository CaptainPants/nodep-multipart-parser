# Zero-Dependency Multipart HTTP Content Parser (Alpha)
See NPM package: [@captainpants/zerodeps-multipart-parser](https://www.npmjs.com/package/@captainpants/zerodeps-multipart-parser)

**This is alpha software**

We are mostly feature complete and API stable. There is also more work to be done on testing.

----

A zero-dependency multipart HTTP content parser, with tools for conveniently switching between string and binary content. Supports back to Internet Explorer 11.

This package includes several useful components:
* Class [MultipartParser](./doc/multipart.md) which will take a **DataView** (wrapping an **ArrayBuffer**) and break it into parts according to a given boundary string.
* Easy to use interface to HTTP single part and multipart content via the [HttpContent](./doc/content.md) class.
* Convenient conversion between `string | Blob | ArrayBuffer | DataView` via the [Data](./doc/data.md) class. This class is similar to the modern **Response** class, but supports older browsers.
* Some [header utilities](./doc/headers.md) for dealing with raw headers, content-type and content-disposition headers.

