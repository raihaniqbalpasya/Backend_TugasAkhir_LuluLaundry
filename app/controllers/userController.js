const userService = require("../services/userService");
const alamatService = require("../services/alamatService");
const pemesananService = require("../services/pemesananService");
const verifyService = require("../services/verifyService");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);
const {
  sendVerificationOTP,
  verifyOTP,
} = require("../../middleware/verificationCode");

module.exports = {
  // User Controller (CRUD) //
  async sendOTPforRegister(req, res) {
    try {
      const user = await userService.getByPhone(req.body.noTelp);
      if (user === undefined || user === null) {
        await sendVerificationOTP(`+${req.body.noTelp}`); // Mengirim OTP melalui WhatsApp
        res.status(201).json({
          status: true,
          message: "OTP successfully sent!",
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Phone number already registered!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async verifyOTPforRegister(req, res) {
    try {
      const otpCode = req.body.otp; // Mengambil kode OTP dari req.body.otp
      const isVerified = await verifyOTP(`+${req.body.noTelp}`, otpCode); // Memverifikasi OTP
      if (isVerified) {
        await verifyService.create({
          otp: otpCode,
        });
        res.status(201).json({
          status: true,
          message: "OTP successfully verified!",
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid OTP",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async register(req, res) {
    try {
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      const otpCode = await verifyService.getByOTP(req.body.otp);
      if (req.body.password === null || req.body.password === "") {
        res.status(422).json({
          status: false,
          message: "Password cannot be empty",
        });
      } else {
        // Memverifikasi OTP
        if (otpCode !== null) {
          const data = await userService.create({
            nama: req.body.nama,
            noTelp: req.body.noTelp,
            email: req.body.email,
            password: hashPassword,
            status: "Full Access",
          });
          await verifyService.delete(req.body.otp);
          res.status(201).json({
            status: true,
            message: "User successfully registered",
            data: data,
          });
        } else {
          res.status(401).json({
            status: false,
            message: "Invalid OTP",
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
        process.env.ACCESS_TOKEN,
        { expiresIn: "3d" }
      );
      res.status(200).json({
        status: true,
        message: "Login Successfull!",
        accessToken: accessToken,
      });
    } catch (err) {
      res.status(422).json({
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
      const data = await userService.getById(req.user.id);
      const pesanan = await pemesananService.getAllData();
      const compare = pesanan.filter((value) => value.userId === data.id);
      const order = compare.length;
      const requestFile = req.file;
      const urlImage = data.profilePic;
      if (
        req.body.password ||
        req.body.password === "" ||
        req.body.password === null ||
        req.body.otp ||
        req.body.otp === "" ||
        req.body.otp === null
      ) {
        res.status(403).json({
          status: false,
          message: "You cannot change your password here",
        });
      } else {
        if (urlImage === null || urlImage === "") {
          if (requestFile === null || requestFile === undefined) {
            const data = await userService.getById(req.user.id);
            await userService.update(req.user.id, {
              nama: req.body.nama || null,
              noTelp: req.body.noTelp || null,
              email: req.body.email || null,
              tglLahir: req.body.tglLahir || null,
              alamatUser: data.alamatUser,
              status: data.status,
              profilePic: null,
              totalOrder: order,
            });
            const print = await userService.getById(req.user.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
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
            const data = await userService.getById(req.user.id);
            await userService.update(req.user.id, {
              nama: req.body.nama || null,
              noTelp: req.body.noTelp || null,
              email: req.body.email || null,
              tglLahir: req.body.tglLahir || null,
              alamatUser: data.alamatUser,
              status: data.status,
              profilePic: url,
              totalOrder: order,
            });
            const print = await userService.getById(req.user.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
            });
          }
        } else {
          if (requestFile === null || requestFile === undefined) {
            const data = await userService.getById(req.user.id);
            await userService.update(req.user.id, {
              nama: req.body.nama || null,
              noTelp: req.body.noTelp || null,
              email: req.body.email || null,
              tglLahir: req.body.tglLahir || null,
              alamatUser: data.alamatUser,
              status: data.status,
              profilePic: urlImage,
              totalOrder: order,
            });
            const print = await userService.getById(req.user.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
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
            const data = await userService.getById(req.user.id);
            await userService.update(req.user.id, {
              nama: req.body.nama || null,
              noTelp: req.body.noTelp || null,
              email: req.body.email || null,
              tglLahir: req.body.tglLahir || null,
              alamatUser: data.alamatUser,
              status: data.status,
              profilePic: url,
              totalOrder: order,
            });
            const print = await userService.getById(req.user.id);
            res.status(200).json({
              status: true,
              message: "Successfully update data",
              data: print,
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

  // async deleteProfile(req, res) {
  //   try {
  //     const data = await userService.delete(req.user.id);
  //     if (data === 1) {
  //       res.status(200).json({
  //         status: true,
  //         message: "Successfully delete account",
  //       });
  //     } else {
  //       res.status(404).json({
  //         status: false,
  //         message: "Data not found",
  //       });
  //     }
  //   } catch (err) {
  //     res.status(422).json({
  //       status: false,
  //       message: err.message,
  //     });
  //   }
  // },

  async deleteProfilePic(req, res) {
    try {
      const data = await userService.getById(req.user.id);
      const urlImage = data.profilePic;
      if (urlImage === null || urlImage === undefined) {
        res.status(404).json({
          status: false,
          message: "Data not found or picture has been deleted",
        });
      } else {
        const getPublicId =
          "profilePic/" + urlImage.split("/").pop().split(".")[0] + "";
        await cloudinaryDelete(getPublicId);
        await userService.update(req.user.id, {
          profilePic: null,
        });
        res.status(200).json({
          status: true,
          message: "Successfully delete picture",
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
      const data = await alamatService.getAllAddress(req.user.id);
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
        status: false,
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
      const data = await alamatService.getAllAddress(req.user.id);
      const compare = data.filter((item) => item.status === "Priority");
      if (req.body.status === "Priority" || req.body.status === "Standard") {
        if (compare.length >= 1 && req.body.status === "Priority") {
          await alamatService.updateAllAddress(req.user.id);
          if (requestFile === null || requestFile === undefined) {
            const data = await alamatService.createAddress(req.user.id, {
              ...req.body,
              gambar: null,
            });
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (req.body.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
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
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (req.body.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
            res.status(201).json({
              status: true,
              message: "Successfully create data",
              data,
            });
          }
        } else if (compare.length < 1 && req.body.status === "Standard") {
          if (requestFile === null || requestFile === undefined) {
            const data = await alamatService.createAddress(req.user.id, {
              ...req.body,
              status: "Priority",
              gambar: null,
            });
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (data.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
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
              status: "Priority",
              gambar: url,
            });
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (data.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
            res.status(201).json({
              status: true,
              message: "Successfully create data",
              data,
            });
          }
        } else {
          if (requestFile === null || requestFile === undefined) {
            const data = await alamatService.createAddress(req.user.id, {
              ...req.body,
              gambar: null,
            });
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (req.body.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
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
            // Menyusun format alamat user
            const addressArrange = [
              data.kecamatan && `Kecamatan ${data.kecamatan}`,
              data.kelurahan && `Kelurahan ${data.kelurahan}`,
              data.rt && `RT${data.rt}`,
              data.rw && `RW${data.rw}`,
              (data.kategori || data.detail) &&
                `${data.kategori} ${data.detail}`,
              data.deskripsi,
            ];
            const alamatUser = addressArrange.filter(Boolean).join(", ");
            if (req.body.status === "Priority") {
              await userService.update(req.user.id, {
                alamatUser: alamatUser,
              });
            }
            res.status(201).json({
              status: true,
              message: "Successfully create data",
              data,
            });
          }
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
        const allData = await alamatService.getAllAddress(req.user.id);
        const compare = allData.filter((item) => item.status === "Priority");
        if (req.body.status === "Priority" || req.body.status === "Standard") {
          if (compare.length >= 1 && req.body.status === "Priority") {
            await alamatService.updateAllAddress(req.user.id);
            const urlImage = data.gambar;
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              }
            }
          } else if (
            data.status === "Priority" &&
            req.body.status === "Standard"
          ) {
            res.status(422).json({
              status: false,
              message: "You can't update status from Priority to Standard!",
            });
          } else {
            const urlImage = data.gambar;
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
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
                // Menyusun format alamat user
                const addressArrange = [
                  data.kecamatan && `Kecamatan ${data.kecamatan}`,
                  data.kelurahan && `Kelurahan ${data.kelurahan}`,
                  data.rt && `RT${data.rt}`,
                  data.rw && `RW${data.rw}`,
                  (data.kategori || data.detail) &&
                    `${data.kategori} ${data.detail}`,
                  data.deskripsi,
                ];
                const alamatUser = addressArrange.filter(Boolean).join(", ");
                if (data.status === "Priority") {
                  await userService.update(req.user.id, {
                    alamatUser: alamatUser,
                  });
                }
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              }
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

  async updateAddressStatustoPriority(req, res) {
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
        const allData = await alamatService.getAllAddress(req.user.id);
        const compare = allData.filter((item) => item.status === "Priority");
        if (compare.length >= 1 && compare[0].status === "Priority") {
          await alamatService.updateAllAddress(req.user.id);
          await alamatService.updateAddressPriority(req.params.id, req.user.id);
          const data = await alamatService.getAddressById(
            req.user.id,
            req.params.id
          );
          // Menyusun format alamat user
          const addressArrange = [
            data.kecamatan && `Kecamatan ${data.kecamatan}`,
            data.kelurahan && `Kelurahan ${data.kelurahan}`,
            data.rt && `RT${data.rt}`,
            data.rw && `RW${data.rw}`,
            (data.kategori || data.detail) && `${data.kategori} ${data.detail}`,
            data.deskripsi,
          ];
          const alamatUser = addressArrange.filter(Boolean).join(", ");
          if (data.status === "Priority") {
            await userService.update(req.user.id, {
              alamatUser: alamatUser,
            });
          }
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data: data,
          });
        } else if (compare.length === 0) {
          await alamatService.updateAddressPriority(req.params.id, req.user.id);
          const data = await alamatService.getAddressById(
            req.user.id,
            req.params.id
          );
          // Menyusun format alamat user
          const addressArrange = [
            data.kecamatan && `Kecamatan ${data.kecamatan}`,
            data.kelurahan && `Kelurahan ${data.kelurahan}`,
            data.rt && `RT${data.rt}`,
            data.rw && `RW${data.rw}`,
            (data.kategori || data.detail) && `${data.kategori} ${data.detail}`,
            data.deskripsi,
          ];
          const alamatUser = addressArrange.filter(Boolean).join(", ");
          if (data.status === "Priority") {
            await userService.update(req.user.id, {
              alamatUser: alamatUser,
            });
          }
          res.status(200).json({
            status: true,
            message: "Successfully update data",
            data: data,
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
      } else if (data.status === "Priority") {
        res.status(422).json({
          status: false,
          message:
            "Cannot delete Priority address! Please change other address to Priority first!",
        });
      } else {
        const urlImage = data.gambar;
        if (urlImage === null) {
          await alamatService.deleteAddress(req.user.id, req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else {
          // mengambil url gambar dari database dan menghapusnya
          const getPublicId =
            "alamat/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await alamatService.deleteAddress(req.user.id, req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
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

  async sendOTP(req, res) {
    try {
      const user = await userService.getByPhone(req.body.noTelp);
      if (user === undefined || user === null) {
        res.status(404).json({
          status: false,
          message: "User not found",
        });
      } else {
        await sendVerificationOTP(`+${req.body.noTelp}`); // Mengirim OTP melalui WhatsApp
        res.status(201).json({
          status: true,
          message: "OTP successfully sent!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async verifyOTP(req, res) {
    try {
      const user = await userService.getByPhone(req.body.noTelp);
      const otpCode = req.body.otp; // Mengambil kode OTP dari req.body.otp
      const isVerified = await verifyOTP(`+${req.body.noTelp}`, otpCode); // Memverifikasi OTP
      if (isVerified) {
        // Update data password yang baru dengan kode OTP yang terverifikasi
        await userService.update(user.id, {
          otp: otpCode,
        });
        res.status(201).json({
          status: true,
          message: "OTP successfully verified!",
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid OTP",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async forgetPassword(req, res) {
    try {
      const user = await userService.getByPhone(req.body.noTelp);
      const otpCode = req.body.otp; // Mengambil kode OTP dari req.body.otp
      const isVerified = user.otp === otpCode; // Memverifikasi OTP
      if (isVerified === true) {
        // Reset password menjadi string kosong
        await userService.update(user.id, {
          password: "",
        });
        // Update data password yang baru dengan kode OTP yang terverifikasi
        const hashPassword = await bcrypt.hashSync(req.body.password, 10);
        await userService.update(user.id, {
          otp: null,
          password: hashPassword,
        });
        res.status(201).json({
          status: true,
          message: "Password successfully changed",
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid OTP",
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
