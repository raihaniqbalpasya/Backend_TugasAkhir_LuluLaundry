const userService = require("../services/userService");
const alamatService = require("../services/alamatService");
const pemesananService = require("../services/pemesananService");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

module.exports = {
  // User Controller (CRUD) //
  async register(req, res) {
    try {
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      const data = await userService.create({
        nama: req.body.nama,
        noTelp: req.body.noTelp,
        email: req.body.email,
        password: hashPassword,
        status: "Full Access",
      });
      if (req.body.password === null || req.body.password === "") {
        res.status(404).json({
          status: false,
          message: "Password cannot be empty",
        });
      } else {
        res.status(201).json({
          status: true,
          message: "User successfully registered",
          data,
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async login(req, res) {
    try {
      const phone = req.body.noTelp;
      const user = await userService.getByPhone(phone);
      if (!user)
        return res.status(404).send({ message: "Phone number not found!" });

      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(400).json({ message: "Wrong Password" });

      const id = user.id;
      const name = user.nama;
      const noTelp = user.noTelp;
      const accessToken = jwt.sign(
        { id, name, noTelp },
        process.env.ACCESS_TOKEN || "secret",
        { expiresIn: "1h" }
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

  async getMyProfile(req, res) {
    try {
      // Fungsi untuk menghitung & update jumlah order user
      const data = await userService.getById(req.user.id);
      const pesanan = await pemesananService.getAllData();
      const compare = pesanan.filter((value) => value.userId === data.id);
      const order = compare.length;
      await userService.update(req.user.id, {
        totalOrder: order,
      });
      const print = await userService.getById(req.user.id);
      res.status(200).json({
        status: true,
        message: "Successfully get user profile",
        data: print,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async searchUser(req, res) {
    try {
      const data = await userService.searchUser(
        req.query.nama,
        req.query.noTelp
      );
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by name or phone number",
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

  async updateProfile(req, res) {
    try {
      // Fungsi untuk menghitung jumlah order user
      const data = await userService.getById(req.params.id);
      const pesanan = await pemesananService.getAllData();
      const compare = pesanan.filter((value) => value.userId === data.id);
      const order = compare.length;
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.profilePic;
        if (req.body.status) {
          res.status(403).json({
            status: false,
            message: "You cannot change your status",
          });
        } else {
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await userService.update(req.params.id, {
                ...req.body,
                profilePic: null,
                totalOrder: order,
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
                totalOrder: order,
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
                totalOrder: order,
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
                totalOrder: order,
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
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteProfile(req, res) {
    try {
      await alamatService.deleteAddressAll(req.user.id);
      const data = await userService.delete(req.user.id);
      if (data === 1) {
        res.status(200).json({
          status: true,
          message: "Successfully delete account",
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

  // Alamat Controller (CRUD) //
  async getAllAddress(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await alamatService.getAllAddress(
        req.user.id,
        perPage,
        start
      ); // Data yang sudah dipaginasi
      const allData = await alamatService.getAllData(); // Seluruh data tanpa paginasi
      const totalCount = await allData.length; // Hitung total item
      const totalPage = Math.ceil(totalCount / perPage); // Hitung total halaman
      const pagination = {}; // Inisialisasi pagination buat nampung response
      if (end < totalCount) {
        //
        pagination.next = {
          page: page + 1,
          perPage: perPage,
        };
      }
      if (start > 0) {
        pagination.previous = {
          page: page - 1,
          perPage: perPage,
        };
      }
      // Respon yang akan ditampilkan jika datanya ada
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
          pagination,
          metadata: {
            page: page,
            perPage: perPage,
            totalPage: totalPage,
            totalCount: totalCount,
          },
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

  async getAddressById(req, res) {
    try {
      const data = await alamatService.getAddressById(
        req.user.id,
        req.params.id
      );
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

  async createAddress(req, res) {
    try {
      const requestFile = req.file;
      if (req.body.status === "Priority" || req.body.status === "Standard") {
        if (requestFile === null || requestFile === undefined) {
          const data = await alamatService.createAddress(req.user.id, {
            ...req.body,
            gambar: null,
          });
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        } else {
          // upload gambar ke cloudinary
          const fileBase64 = requestFile.buffer.toString("base64");
          const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
          const result = await cloudinaryUpload(file, {
            folder: "alamat",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await alamatService.createAddress(req.user.id, {
            ...req.body,
            gambar: url,
          });
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the status correctly!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async updateAddress(req, res) {
    try {
      const data = await alamatService.getAddressById(
        req.user.id,
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
        if (req.body.status === "Priority" || req.body.status === "Standard") {
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await alamatService.updateAddress(req.params.id, req.user.id, {
                ...req.body,
                gambar: null,
              });
              const data = await alamatService.getAddressById(
                req.user.id,
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
              await alamatService.updateAddress(req.params.id, req.user.id, {
                ...req.body,
                gambar: url,
              });
              const data = await alamatService.getAddressById(
                req.user.id,
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
              await alamatService.updateAddress(req.params.id, req.user.id, {
                ...req.body,
                gambar: urlImage,
              });
              const data = await alamatService.getAddressById(
                req.user.id,
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
              await alamatService.updateAddress(req.params.id, req.user.id, {
                ...req.body,
                gambar: url,
              });
              const data = await alamatService.getAddressById(
                req.user.id,
                req.params.id
              );
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          }
        } else {
          res.status(400).json({
            status: false,
            message: "Please input the status correctly!",
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

  async deleteAddress(req, res) {
    try {
      const data = await alamatService.getAddressById(
        req.user.id,
        req.params.id
      );
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (data === 1 || urlImage) {
          // mengambil url gambar dari database dan menghapusnya
          const getPublicId =
            "alamat/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await alamatService.deleteAddress(req.params.id, req.user.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await alamatService.deleteAddress(req.params.id, req.user.id);
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
  async deleteAllAddress(req, res) {
    try {
      const data = await alamatService.deleteAddressAll(req.user.id);
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
    const user = await userService.getByPhone(req.user.noTelp);
    if (user) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        if (req.body.password === req.body.oldPassword) {
          res.status(404).json({
            status: false,
            message: "Please create a different new password!",
          });
        } else {
          await userService.update(user.id, {
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
