const debug = require("debug")("app:startup");
const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    debug("StatusCode : " + statusCode);
  
    switch (statusCode) {
      case constants.BAD_REQUEST:
        res.json({
          title: "Validation Failed",
          message: err.message,
        });
        break;
      case constants.UNAUTHORIZED:
        res.json({
          title: "Unauthorized",
          message: err.message,
        });
        break;
      case constants.FORBIDDEN:
        res.json({
          title: "Forbidden",
          message: err.message,
        });
        break;
      case constants.NOT_FOUND:
        res.json({
          title: "Not Found",
          message: err.message,
        });
        break;
      case constants.SERVER_ERROR:
        res.json({
          title: "Server Error",
          message: err.message,
        });
        break;
      default:
        debug("No Error");
    }
  };
  
  module.exports = errorHandler;

  // exports.constants = {
//     VALIDATION_ERROR: 400,  // Bad request -> When the client requests a page and the server is not able to understand anything, it displays a 400 HTTP status code.
//     UNAUTHORIZED: 401,      // Unauthorized -> This HTTP status code requires user authentication. if you provide wrong one then it give you another chance to retry
//     FORBIDDEN: 403,         // Forbidden -> The HTTP status code 403 implies that the request is understood by the server, but still refuses to fulfill it.
//     NOT_FOUND: 404,         // Not Found -> 404 HTTP Status code appears when you request a URL and then the server has not found anything.
//     SERVER_ERROR: 500,      //  Internal Server Error  -> A valid request was made by the client but the server failed to complete the request
// }
