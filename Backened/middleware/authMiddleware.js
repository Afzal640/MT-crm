import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ msg: "No token" });

  const token = header.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);
    

req.user = {
  _id: decoded.id,   // normalize
  role: decoded.role,
  name: decoded.name
};

next();
  } catch (error) {
    console.log("JWT Verify Error:", error.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};