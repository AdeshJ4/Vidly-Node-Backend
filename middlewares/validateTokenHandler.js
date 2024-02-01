const jwt = require("jsonwebtoken");
const config = require("config");

function validateToken(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    /**
     * decoded data is the payload data that we set in our userMode inside generateToken.
     * now we are adding extra property inside a req which is user
     * we can access user property like this :
     * req.user._id or req.user.name
     */
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log("Decoded Token : ", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
}

module.exports = validateToken;

// Unauthorized: 401 -> This HTTP status code requires user authentication.
