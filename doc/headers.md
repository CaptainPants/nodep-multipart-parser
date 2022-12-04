# Header Parsing
This library provides several useful methods for dealing with HTTP Headers:
- **parseHeaders** - Parses a string into a list of named headers
- **parseContentType** - Takes the value of the Content-Type header and returns the content in a usable format
- **serializeContentType** - Write an object representing a Content-Type to the correct format for a HTTP header
- **parseContentDisposition** - Takes the value of the Content-Type header and returns the content in a usable format
- **serializeContentDisposition** - Write an object representing a Content-Type to the correct format for a HTTP header
- **isTextMediaType** and **isMultipartMediaType** for detecting if response content is text or multipart respectively.

# parseHeaders
Useful for reading the headers in an XMLHttpRequest's response ([XMLHttpRequest.getAllResponseHeaders()](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)) into an array.
