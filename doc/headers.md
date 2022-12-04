# Header Parsing
This library provides several useful methods for dealing with HTTP Headers:
- **parseHeaders** - Parses a string into a list of named headers, useful for processing headers from XMLHttpRequest [XMLHttpRequest.getAllResponseHeaders()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders) or from parts of a multipart HTTP message.
- **parseContentType** - Takes the value of the Content-Type header and returns the content in a usable format.
- **serializeContentType** - Write an object representing a Content-Type to the correct format for a HTTP header.
- **parseContentDisposition** - Takes the value of the Content-Type header and returns the content in a usable format.
- **serializeContentDisposition** - Write an object representing a Content-Type to the correct format for a HTTP header.
- **isTextMediaType** and **isMultipartMediaType** - For detecting if response mediatype is text or multipart respectively.

# Reading
The implementation of these methods is based on the following RFCs:
 - HTTP Semantics   https://datatracker.ietf.org/doc/html/rfc9110
 - HTTP/1.1         https://datatracker.ietf.org/doc/html/rfc9112
 - And in particular for header parameters: https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.6 and https://datatracker.ietf.org/doc/html/rfc8187#section-3.1
