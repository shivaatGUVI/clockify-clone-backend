// middleware/checkAdmin.js
const checkAdmin = (req, res, next) => {
  const user = req.body.user; // We expect the user data to be passed in the body

  if (!user) {
    return res.status(401).json({ message: "User data not provided" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // If user is admin, allow the request to proceed
  next();
};

module.exports = checkAdmin;
