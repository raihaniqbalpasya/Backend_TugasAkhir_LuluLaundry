const adminService = require("../services/adminService");
const alamatService = require("../services/alamatService");
const userService = require("../services/userService");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  // Admin Controller (CRUD) //
  async login(req, res) {
    try {
      const name = req.body.nama;
      const admin = await adminService.getByName(name);
      if (!admin)
        return res.status(404).send({ message: "Admin name not found!" });

      const match = await bcrypt.compare(req.body.password, admin.password);
      if (!match) return res.status(400).json({ message: "Wrong Password" });

      const id = admin.id;
      const nama = admin.nama;
      const role = admin.role;
      const noTelp = admin.noTelp;
      const accessToken = jwt.sign(
        { id, nama, role, noTelp },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        status: true,
        message: "Login Successfull!",
        accessToken: accessToken,
      });
    } catch (err) {
      res.status(404).json({
        status: false,
        message: err.message,
      });
    }
  },

  async getAll(req, res) {
    try {
      const data = await adminService.getAll();
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Data empty, Please input some data!",
        });
      }
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
        profilePic: req.body.profilePic,
      });
      res.status(201).json({
        status: true,
        message: "Admin successfully registered",
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
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      await adminService.update(req.params.id, {
        role: req.body.role,
        nama: req.body.nama,
        email: req.body.email,
        password: hashPassword,
        noTelp: req.body.noTelp,
        otp: req.body.otp,
        profilePic: req.body.profilePic,
      });
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

  // User Controller (CRUD) //
  async getAllUser(req, res) {
    try {
      const data = await userService.getAllUser();
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Data empty, Please input some data!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: true,
        message: err.message,
      });
    }
  },

  async createUser(req, res) {
    try {
      const data = await userService.create({
        nama: req.body.nama,
        noTelp: req.body.noTelp,
        email: req.body.email,
        status: "limited access",
      });
      await alamatService.adminCreated(req.body, data.id);
      res.status(201).json({
        status: true,
        message: "User successfully registered",
        data,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateUser(req, res) {
    try {
      await userService.update(req.params.id, {
        nama: req.body.nama,
        noTelp: req.body.noTelp,
        email: req.body.email,
        status: "limited access",
      });
      const data = await userService.getById(req.params.id);
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

  async updateUserAddress(req, res) {
    try {
      await alamatService.adminUpdated(req.params.userId, req.params.id, {
        kategori: req.body.kategori,
        detail: req.body.detail,
        kecamatan: req.body.kecamatan,
        kelurahan: req.body.kelurahan,
        rt: req.body.rt,
        rw: req.body.rw,
        deskripsi: req.body.deskripsi,
        gambar: req.body.gambar,
        status: "priority",
      });
      const data = await alamatService.getAddressById(
        req.params.userId,
        req.params.id
      );
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

  async deleteUser(req, res) {
    try {
      const data = await userService.delete(req.params.id);
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

  async deleteUserAddress(req, res) {
    try {
      const data = await alamatService.deleteAddressAll(req.params.userId);
      if (data !== 0) {
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

  // Change Password //
  async changePassword(req, res) {
    const admin = await adminService.getByName(req.admin.nama);
    if (admin) {
      const isMatch = await bcrypt.compare(
        req.body.oldPassword,
        admin.password
      );
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        if (req.body.password === req.body.oldPassword) {
          res.status(404).json({
            status: false,
            message: "Please create a different new password!",
          });
        } else {
          await adminService.update(admin.id, {
            password: newPassword,
          });
          res.status(200).json({
            status: true,
            message: "Successfully change password",
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "Password not match with old password",
        });
      }
    } else {
      res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  },
};
