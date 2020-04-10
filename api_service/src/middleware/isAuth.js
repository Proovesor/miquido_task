import { User } from "../api/user.controller";

export default async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = await User.verifyToken(token);
    const { error } = decoded;
    if (error) {
      req.isAuth = false;
      return next();
    }
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decoded) {
    req.isAuth = false;
    return next();
  }

  req.userEmail = decoded.email;
  req.isAuth = true;

  next();
};
