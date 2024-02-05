const adminService = require("../services/adminService");
const alamatService = require("../services/alamatService");
const userService = require("../services/userService");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

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
      await adminService.update(req.params.id, {
        role: req.body.role,
        nama: req.body.nama,
        email: req.body.email,
        noTelp: req.body.noTelp,
        otp: req.body.otp,
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
      if (
        req.files["profilePic"] &&
        req.files["profilePic"][0] &&
        req.files["gambar"] &&
        req.files["gambar"][0]
      ) {
        const reqFileUser = req.files["profilePic"][0];
        const reqFileAddress = req.files["gambar"][0];
        // upload gambar profile user ke cloudinary
        const fileBase64 = reqFileUser.buffer.toString("base64");
        const file = `data:${reqFileUser.mimetype};base64,${fileBase64}`;
        const userPic = await cloudinaryUpload(file, {
          folder: "profilePic",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        });
        const urlUser = userPic.secure_url;

        // upload gambar alamat user ke cloudinary
        const fileBase64Add = reqFileAddress.buffer.toString("base64");
        const fileAdd = `data:${reqFileAddress.mimetype};base64,${fileBase64Add}`;
        const addPic = await cloudinaryUpload(fileAdd, {
          folder: "alamat",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        });
        const urlAddress = addPic.secure_url;

        const dataUser = await userService.create({
          ...req.body,
          profilePic: urlUser,
          status: "limited access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: urlAddress,
          status: "priority",
        });
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data: {
            User: dataUser,
            Alamat: dataAddress,
          },
        });
      } else if (req.files["profilePic"] && req.files["profilePic"][0]) {
        const reqFileUser = req.files["profilePic"][0];
        // upload gambar profile user ke cloudinary
        const fileBase64 = reqFileUser.buffer.toString("base64");
        const file = `data:${reqFileUser.mimetype};base64,${fileBase64}`;
        const userPic = await cloudinaryUpload(file, {
          folder: "profilePic",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        });
        const urlUser = userPic.secure_url;

        const dataUser = await userService.create({
          ...req.body,
          profilePic: urlUser,
          status: "limited access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: null,
          status: "priority",
        });
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data: {
            User: dataUser,
            Alamat: dataAddress,
          },
        });
      } else if (req.files["gambar"] && req.files["gambar"][0]) {
        const reqFileAddress = req.files["gambar"][0];
        // upload gambar alamat user ke cloudinary
        const fileBase64Add = reqFileAddress.buffer.toString("base64");
        const fileAdd = `data:${reqFileAddress.mimetype};base64,${fileBase64Add}`;
        const addPic = await cloudinaryUpload(fileAdd, {
          folder: "alamat",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        });
        const urlAddress = addPic.secure_url;

        const dataUser = await userService.create({
          ...req.body,
          profilePic: null,
          status: "limited access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: urlAddress,
          status: "priority",
        });
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data: {
            User: dataUser,
            Alamat: dataAddress,
          },
        });
      } else {
        const dataUser = await userService.create({
          ...req.body,
          profilePic: null,
          status: "limited access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: null,
          status: "priority",
        });
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data: {
            User: dataUser,
            Alamat: dataAddress,
          },
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateUser(req, res) {
    try {
      const data = await userService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.profilePic;
        if (urlImage === null || urlImage === "") {
          if (requestFile === null || requestFile === undefined) {
            await userService.update(req.params.id, {
              ...req.body,
              profilePic: null,
              status: "limited access",
            });
            const data = await userService.getById(req.params.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          } else {
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "profilePic",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            await userService.update(req.params.id, {
              ...req.body,
              profilePic: url,
              status: "limited access",
            });
            const data = await userService.getById(req.params.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          }
        } else {
          if (requestFile === null || requestFile === undefined) {
            await userService.update(req.params.id, {
              ...req.body,
              profilePic: urlImage,
              status: "limited access",
            });
            const data = await userService.getById(req.params.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          } else {
            // mengambil url gambar dari cloudinary dan menghapusnya
            const getPublicId =
              "profilePic/" + urlImage.split("/").pop().split(".")[0] + "";
            await cloudinaryDelete(getPublicId);
            // upload gambar ke cloudinary
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "profilePic",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            await userService.update(req.params.id, {
              ...req.body,
              profilePic: url,
              status: "limited access",
            });
            const data = await userService.getById(req.params.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          }
        }
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
      const data = await alamatService.getAddressById(
        req.params.userId,
        req.params.id
      );
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (urlImage === null || urlImage === "") {
          if (requestFile === null || requestFile === undefined) {
            await alamatService.adminUpdated(req.params.userId, req.params.id, {
              ...req.body,
              gambar: null,
              status: "priority",
            });
            const data = await alamatService.getAddressById(
              req.params.userId,
              req.params.id
            );
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          } else {
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "alamat",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            await alamatService.adminUpdated(req.params.userId, req.params.id, {
              ...req.body,
              gambar: url,
              status: "priority",
            });
            const data = await alamatService.getAddressById(
              req.params.userId,
              req.params.id
            );
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          }
        } else {
          if (requestFile === null || requestFile === undefined) {
            await alamatService.adminUpdated(req.params.userId, req.params.id, {
              ...req.body,
              gambar: urlImage,
              status: "priority",
            });
            const data = await alamatService.getAddressById(
              req.params.userId,
              req.params.id
            );
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          } else {
            // mengambil url gambar dari cloudinary dan menghapusnya
            const getPublicId =
              "alamat/" + urlImage.split("/").pop().split(".")[0] + "";
            await cloudinaryDelete(getPublicId);
            // upload gambar ke cloudinary
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "alamat",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            await alamatService.adminUpdated(req.params.userId, req.params.id, {
              ...req.body,
              gambar: url,
              status: "priority",
            });
            const data = await alamatService.getAddressById(
              req.params.userId,
              req.params.id
            );
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: data,
            });
          }
        }
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
      const data = await userService.getById(req.params.id);
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.profilePic;
        if (data === 1 || urlImage) {
          // mengambil url gambar dari database dan menghapusnya
          const getPublicId =
            "profilePic/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await userService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await userService.delete(req.params.id);
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
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  /*blom bisa hapus gambar sekaligus semua,
  jadi sementara yg terhapus cuma API-nya doang*/
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
