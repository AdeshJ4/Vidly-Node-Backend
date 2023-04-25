exports.constants = {
  BAD_REQUEST: 400, // Bad request -> When the client requests a page and the server is not able to understand anything, it displays a 400 HTTP status code.
  UNAUTHORIZED: 401, // Unauthorized -> This HTTP status code requires user authentication.
  FORBIDDEN: 403, // Forbidden -> The HTTP status code 403 implies that the request is understood by the server, but still refuses to fulfill it.
  NOT_FOUND: 404, // Not Found -> 404 HTTP Status code appears when you request a URL and then the server has not found anything.
  SERVER_ERROR: 500, //  Internal Server Error  -> A valid request was made by the client but the server failed to complete the request
};
