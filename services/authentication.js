import jwt from "jsonwebtoken";

const secret = "habibi";

export const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

export const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};
