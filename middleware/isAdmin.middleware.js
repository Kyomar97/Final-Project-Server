module.exports = (req, res, next) => {
  // Assuming the JWT middleware adds user data to req.payload
  if (req.payload && req.payload.rol === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};
