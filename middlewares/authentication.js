import { validateToken } from "../services/authentication.js";

export const checkForAuthCookie = () => {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies["token"];
    if (!tokenCookieValue) return next();

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
};
