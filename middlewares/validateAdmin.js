// 401 - Unauthorized - give chance to resend valid json token
// 403 - Forbidden    - if they sent valid json token but still don;t get access to api endpoint then they are forbidden

// this middleware will execute after validateTokenHandler
const validateAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send("Access Denied");
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = validateAdmin;