export const protectRoute = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  // For now, we are not verifying JWT. Replace with JWT verification if needed
  if (token !== "FAKE-JWT-TOKEN") {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};
