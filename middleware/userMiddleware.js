require("dotenv").config();
const jwt = require("jsonwebtoken");
const userService = require("../app/services/userService");

module.exports = {
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN
      );

      req.user = await userService.getByPhone(tokenPayload.noTelp);
      if (!req.user) {
        res.status(401).json({
          status: false,
          message: "Anda tidak punya akses (Unauthorized)",
        });
        return;
      }

      next();
    } catch (error) {
      if (error.message.includes("jwt expired")) {
        res.status(401).json({ message: "Token Expired" });
        return;
      }

      res.status(401).json({
        message: "Anda tidak punya akses (Unauthorized)",
      });
    }
  },
};
