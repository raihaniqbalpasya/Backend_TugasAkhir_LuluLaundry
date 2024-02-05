require("dotenv").config();
const jwt = require("jsonwebtoken");
const adminService = require("../app/services/adminService");

module.exports = {
  async authorize(req, res, next) {
    try {
      const bearerToken = req.headers.authorization;
      const token = bearerToken.split("Bearer ")[1];
      const tokenPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN
      );

      req.admin = await adminService.getByName(tokenPayload.nama);
      if (!req.admin) {
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

  async isBasic(req, res, next) {
    try {
      const adminTokenRole = req.admin.role;
      if (!(adminTokenRole === "Basic")) {
        res.status(401).json({
          status: false,
          message: "Anda tidak punya akses (Unauthorized)",
        });
        return;
      }
      next();
    } catch (error) {
      if (error.message.includes("jwt expired")) {
        res.status(401).json({
          status: false,
          message: "Token Expired",
        });
        return;
      }
      res.status(401).json({
        status: false,
        message: "Anda tidak punya akses (Unauthorized)",
      });
    }
  },

  async isMaster(req, res, next) {
    try {
      const adminTokenRole = req.admin.role;
      if (!(adminTokenRole === "Master")) {
        res.status(401).json({
          status: false,
          message: "Anda tidak punya akses (Unauthorized)",
        });
        return;
      }
      next();
    } catch (error) {
      if (error.message.includes("jwt expired")) {
        res.status(401).json({
          status: false,
          message: "Token Expired",
        });
        return;
      }
      res.status(401).json({
        status: false,
        message: "Anda tidak punya akses (Unauthorized)",
      });
    }
  },
};
