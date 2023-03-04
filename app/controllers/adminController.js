const adminService = require("../services/adminService");
const bcrypt = require("bcrypt");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await adminService.getAll();
      res.status(200).json({
        status: true,
        message: "Successfully get all data",
        data,
      });
    } catch (err) {
      res.status(422).json({
        status: true,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await adminService.getById(req.params.id);
      if (data !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by id",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async create(req, res) {
    try {
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      const data = await adminService.create({
        role: req.body.role,
        nama: req.body.nama,
        email: req.body.email,
        password: hashPassword,
        noTelp: req.body.noTelp,
        otp: req.body.otp,
        alamat: req.body.alamat,
        profilePic: req.body.profilePic,
      });
      res.status(201).json({
        status: true,
        message: "Successfully create data",
        data,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async update(req, res) {
    try {
      await adminService.update(req.params.id, req.body);
      const data = await adminService.getById(req.params.id);
      if (data !== null) {
        res.status(200).json({
          status: true,
          message: "Successfully update data",
          data: data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteById(req, res) {
    try {
      const data = await adminService.delete(req.params.id);
      if (data === 1) {
        res.status(200).json({
          status: true,
          message: "Successfully delete data",
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },
};
