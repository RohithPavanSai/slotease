// server/utils/jwt.js
import jwt from "jsonwebtoken";

export const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
