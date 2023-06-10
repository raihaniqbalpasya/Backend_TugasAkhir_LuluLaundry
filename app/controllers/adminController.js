const adminService = require("../services/adminService");
const alamatService = require("../services/alamatService");
const userService = require("../services/userService");
const pemesananService = require("../services/pemesananService");
const reviewService = require("../services/reviewService");
const acaraService = require("../services/acaraService");
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
        process.env.ACCESS_TOKEN || "secret",
        {
          expiresIn: "1d",
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
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await adminService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await adminService.getAllData(); // Seluruh data tanpa paginasi
      const totalCount = await allData.length; // Hitung total item
      const totalPage = Math.ceil(totalCount / perPage); // Hitung total halaman
      const pagination = {}; // Inisialisasi pagination buat nampung response
      if (end < totalCount) {
        // Pagination next jika jumlah data melebihi jumlah data per halaman
        pagination.next = {
          page: page + 1,
          perPage: perPage,
        };
      }
      if (start > 0) {
        // Pagination previous jika sedang berada di halaman selain halaman pertama
        pagination.previous = {
          page: page - 1,
          perPage: perPage,
        };
      }
      const pemesanan = await pemesananService.getAllData(); // Mengambil seluruh data pemesanan
      // Memfilter jumlah pemesanan yang sedang berlangsung
      const pesananAktif = pemesanan.filter(
        (item) =>
          item.status === "Perlu Dijemput" ||
          item.status === "Perlu Dikerjakan" ||
          item.status === "Perlu Diantar"
      ).length;
      // Memfilter jumlah pemesanan yang sudah selesai
      const pesananSelesai = pemesanan.filter(
        (item) => item.status === "Selesai"
      ).length;
      const event = await acaraService.getAllData(); // Mengambil seluruh data event
      // Memfilter jumlah event yang aktif
      const jumlahEvent = event.filter(
        (item) => item.status === "Aktif"
      ).length;
      const totalUser = await userService.getAllData(); // Mengambil seluruh data user
      // Menghitung jumlah rata-rata rating
      const rating = await reviewService.getAllData();
      const totalRating = rating.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRating / rating.length;
      const finalRating = parseFloat(averageRating.toFixed(2));
      // Respon yang akan ditampilkan jika datanya ada
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get all data",
          data,
          pagination,
          otherData: {
            pesananAktif: pesananAktif,
            pesananSelesai: pesananSelesai,
            eventAktif: jumlahEvent,
            totalPelanggan: totalUser.length,
            averageRating: finalRating || 0,
            totalReview: rating.length,
          },
          metadata: {
            page: page,
            perPage: perPage,
            totalPage: totalPage,
            totalCount: totalCount,
          },
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

  async getMyProfile(req, res) {
    try {
      const data = await adminService.getById(req.admin.id);
      res.status(200).json({
        status: true,
        message: "Successfully get admin profile",
        data,
      });
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async searchAdmin(req, res) {
    try {
      const data = await adminService.searchAdmin(
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

  async create(req, res) {
    try {
      const requestFile = req.file;
      const hashPassword = await bcrypt.hashSync(req.body.password, 10);
      if (
        (req.body.role === "Master" || req.body.role === "Basic") &&
        (req.body.status === "Aktif" || req.body.status === "Nonaktif")
      ) {
        if (requestFile === null || requestFile === undefined) {
          const data = await adminService.create(req.admin.nama, {
            role: req.body.role || null,
            nama: req.body.nama || null,
            email: req.body.email || null,
            noTelp: req.body.noTelp || null,
            status: req.body.status || null,
            password: hashPassword,
            otp: null,
            profilePic: null,
            updatedBy: null,
          });
          res.status(201).json({
            status: true,
            message: "Admin successfully registered",
            data,
          });
        } else {
          // upload gambar ke cloudinary
          const fileBase64 = requestFile.buffer.toString("base64");
          const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
          const result = await cloudinaryUpload(file, {
            folder: "adminProfilePic",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await adminService.create(req.admin.nama, {
            role: req.body.role || null,
            nama: req.body.nama || null,
            email: req.body.email || null,
            noTelp: req.body.noTelp || null,
            status: req.body.status || null,
            password: hashPassword,
            otp: null,
            profilePic: url,
            updatedBy: null,
          });
          res.status(201).json({
            status: true,
            message: "Admin successfully registered",
            data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please input the role or status correctly!",
        });
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async update(req, res) {
    try {
      const data = await adminService.getByIdAll(req.params.id);
      const password = data.password;
      const otp = data.otp;
      const createdBy = data.createdBy;
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.profilePic;
        if (
          (req.body.role === "Master" || req.body.role === "Basic") &&
          (req.body.status === "Aktif" || req.body.status === "Nonaktif")
        ) {
          const allData = await adminService.getAllData();
          const compare = allData.filter((item) => item.role === "Master");
          if (req.body.role === "Basic" && compare.length >= 1) {
            res.status(422).json({
              status: false,
              message:
                "Cannot update role to Basic if there's only one Master Admin left!",
            });
          } else {
            if (urlImage === null || urlImage === "") {
              if (requestFile === null || requestFile === undefined) {
                await adminService.update(req.params.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: null,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.params.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              } else {
                const fileBase64 = requestFile.buffer.toString("base64");
                const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
                const result = await cloudinaryUpload(file, {
                  folder: "adminProfilePic",
                  resource_type: "image",
                  allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
                });
                const url = result.secure_url;
                await adminService.update(req.params.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: url,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.params.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              }
            } else {
              if (requestFile === null || requestFile === undefined) {
                await adminService.update(req.params.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: urlImage,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.params.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              } else {
                // mengambil url gambar dari cloudinary dan menghapusnya
                const getPublicId =
                  "adminProfilePic/" +
                  urlImage.split("/").pop().split(".")[0] +
                  "";
                await cloudinaryDelete(getPublicId);
                // upload gambar ke cloudinary
                const fileBase64 = requestFile.buffer.toString("base64");
                const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
                const result = await cloudinaryUpload(file, {
                  folder: "adminProfilePic",
                  resource_type: "image",
                  allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
                });
                const url = result.secure_url;
                await adminService.update(req.params.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: url,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.params.id);
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
            message: "Please input the role or status correctly!",
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

  async updateMyProfile(req, res) {
    try {
      const data = await adminService.getByIdAll(req.admin.id);
      const password = data.password;
      const otp = data.otp;
      const createdBy = data.createdBy;
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.profilePic;
        if (
          (req.body.role === "Master" || req.body.role === "Basic") &&
          (req.body.status === "Aktif" || req.body.status === "Nonaktif")
        ) {
          const allData = await adminService.getAllData();
          const compare = allData.filter((item) => item.role === "Master");
          if (req.body.role === "Basic" && compare.length >= 1) {
            res.status(422).json({
              status: false,
              message:
                "Cannot update role to Basic if there's only one Master Admin left!",
            });
          } else {
            if (urlImage === null || urlImage === "") {
              if (requestFile === null || requestFile === undefined) {
                await adminService.update(req.admin.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: null,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.admin.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              } else {
                const fileBase64 = requestFile.buffer.toString("base64");
                const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
                const result = await cloudinaryUpload(file, {
                  folder: "adminProfilePic",
                  resource_type: "image",
                  allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
                });
                const url = result.secure_url;
                await adminService.update(req.admin.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: url,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.admin.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              }
            } else {
              if (requestFile === null || requestFile === undefined) {
                await adminService.update(req.admin.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: urlImage,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.admin.id);
                res.status(200).json({
                  status: true,
                  message: "Successfully update data",
                  data: data,
                });
              } else {
                // mengambil url gambar dari cloudinary dan menghapusnya
                const getPublicId =
                  "adminProfilePic/" +
                  urlImage.split("/").pop().split(".")[0] +
                  "";
                await cloudinaryDelete(getPublicId);
                // upload gambar ke cloudinary
                const fileBase64 = requestFile.buffer.toString("base64");
                const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
                const result = await cloudinaryUpload(file, {
                  folder: "adminProfilePic",
                  resource_type: "image",
                  allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
                });
                const url = result.secure_url;
                await adminService.update(req.admin.id, req.admin.nama, {
                  role: req.body.role || null,
                  nama: req.body.nama || null,
                  email: req.body.email || null,
                  noTelp: req.body.noTelp || null,
                  status: req.body.status || null,
                  password: password,
                  otp: otp,
                  profilePic: url,
                  createdBy: createdBy,
                });
                const data = await adminService.getById(req.admin.id);
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
            message: "Please input the role or status correctly!",
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

  async deleteById(req, res) {
    try {
      const allData = await adminService.getAllData();
      const compare = allData.filter((item) => item.role === "Master");
      if (compare.length <= 1) {
        res.status(422).json({
          status: false,
          message: "Cannot delete the last Master Admin",
        });
      } else {
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
      }
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async deleteProfilePic(req, res) {
    try {
      const data = await adminService.getByIdAll(req.admin.id);
      const urlImage = data.profilePic;
      if (urlImage === null || urlImage === undefined) {
        res.status(404).json({
          status: false,
          message: "Data not found or picture has been deleted",
        });
      } else {
        const getPublicId =
          "adminProfilePic/" + urlImage.split("/").pop().split(".")[0] + "";
        await cloudinaryDelete(getPublicId);
        await adminService.updateProfilePic(req.admin.id, {
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

  // User Controller (CRUD) //
  async getAllUser(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Halaman saat ini
      const perPage = parseInt(req.query.perPage) || 10; // Jumlah item per halaman
      const allowedPerPage = [10, 20, 50, 100]; // Pastikan jumlah data per halaman yang didukung
      if (!allowedPerPage.includes(perPage)) {
        perPage = 10; // Jika tidak valid, gunakan 10 data per halaman sebagai default
      }
      const start = 0 + (page - 1) * perPage; // Offset data yang akan diambil
      const end = page * perPage; // Batas data yang akan diambil
      const data = await userService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await userService.getAllData(); // Seluruh data tanpa paginasi
      const totalCount = await allData.length; // Hitung total item
      const totalPage = Math.ceil(totalCount / perPage); // Hitung total halaman
      const pagination = {}; // Inisialisasi pagination buat nampung response
      if (end < totalCount) {
        // Pagination next jika jumlah data melebihi jumlah data per halaman
        pagination.next = {
          page: page + 1,
          perPage: perPage,
        };
      }
      if (start > 0) {
        // Pagination previous jika sedang berada di halaman selain halaman pertama
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
          nama: req.body.nama || null,
          noTelp: req.body.noTelp || null,
          email: req.body.email || null,
          tglLahir: req.body.tglLahir || null,
          profilePic: urlUser,
          status: "Limited Access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: urlAddress,
          status: "Priority",
        });
        // update alamat user ke tabel user
        await userService.update(dataUser.id, {
          alamatUser: `Kecamatan ${dataAddress.kecamatan}, Kelurahan ${dataAddress.kelurahan}, RT${dataAddress.rt}, RW${dataAddress.rw}, ${dataAddress.detail}, ${dataAddress.deskripsi}`,
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
          nama: req.body.nama || null,
          noTelp: req.body.noTelp || null,
          email: req.body.email || null,
          tglLahir: req.body.tglLahir || null,
          profilePic: urlUser,
          status: "Limited Access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: null,
          status: "Priority",
        });
        // update alamat user ke tabel user
        await userService.update(dataUser.id, {
          alamatUser: `Kecamatan ${dataAddress.kecamatan}, Kelurahan ${dataAddress.kelurahan}, RT${dataAddress.rt}, RW${dataAddress.rw}, ${dataAddress.detail}, ${dataAddress.deskripsi}`,
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
          nama: req.body.nama || null,
          noTelp: req.body.noTelp || null,
          email: req.body.email || null,
          tglLahir: req.body.tglLahir || null,
          profilePic: null,
          status: "Limited Access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: urlAddress,
          status: "Priority",
        });
        // update alamat user ke tabel user
        await userService.update(dataUser.id, {
          alamatUser: `Kecamatan ${dataAddress.kecamatan}, Kelurahan ${dataAddress.kelurahan}, RT${dataAddress.rt}, RW${dataAddress.rw}, ${dataAddress.detail}, ${dataAddress.deskripsi}`,
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
          nama: req.body.nama || null,
          noTelp: req.body.noTelp || null,
          email: req.body.email || null,
          tglLahir: req.body.tglLahir || null,
          profilePic: null,
          status: "Limited Access",
        });
        const dataAddress = await alamatService.adminCreated(dataUser.id, {
          ...req.body,
          gambar: null,
          status: "Priority",
        });
        // update alamat user ke tabel user
        await userService.update(dataUser.id, {
          alamatUser: `Kecamatan ${dataAddress.kecamatan}, Kelurahan ${dataAddress.kelurahan}, RT${dataAddress.rt}, RW${dataAddress.rw}, ${dataAddress.detail}, ${dataAddress.deskripsi}`,
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
      // Fungsi untuk menghitung & update jumlah order user
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
        if (
          req.body.alamatUser ||
          req.body.alamatUser === null ||
          req.body.alamatUser === ""
        ) {
          res.status(422).json({
            status: false,
            message: "Cannot change alamatUser!",
          });
        } else {
          const urlImage = data.profilePic;
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              const data = await userService.getById(req.params.id);
              await userService.update(req.params.id, {
                nama: req.body.nama || null,
                noTelp: req.body.noTelp || null,
                email: req.body.email || null,
                tglLahir: req.body.tglLahir || null,
                profilePic: null,
                status: data.status,
                totalOrder: order,
              });
              const print = await userService.getById(req.params.id);
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
              const data = await userService.getById(req.params.id);
              await userService.update(req.params.id, {
                nama: req.body.nama || null,
                noTelp: req.body.noTelp || null,
                email: req.body.email || null,
                tglLahir: req.body.tglLahir || null,
                profilePic: url,
                status: data.status,
                totalOrder: order,
              });
              const print = await userService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              const data = await userService.getById(req.params.id);
              await userService.update(req.params.id, {
                nama: req.body.nama || null,
                noTelp: req.body.noTelp || null,
                email: req.body.email || null,
                tglLahir: req.body.tglLahir || null,
                profilePic: urlImage,
                status: data.status,
                totalOrder: order,
              });
              const print = await userService.getById(req.params.id);
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
              const data = await userService.getById(req.params.id);
              await userService.update(req.params.id, {
                nama: req.body.nama || null,
                noTelp: req.body.noTelp || null,
                email: req.body.email || null,
                tglLahir: req.body.tglLahir || null,
                profilePic: url,
                status: data.status,
                totalOrder: order,
              });
              const print = await userService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
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
        if (req.body.status === "Priority" || req.body.status === "Standard") {
          if (data.status === "Priority" && req.body.status === "Standard") {
            res.status(422).json({
              status: false,
              message: "You can't update status from Priority to Standard!",
            });
          } else if (
            data.status === "Standard" &&
            req.body.status === "Priority"
          ) {
            await alamatService.updateAllAddress(req.params.userId);
            if (urlImage === null || urlImage === "") {
              if (requestFile === null || requestFile === undefined) {
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: null,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: url,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: urlImage,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: url,
                  }
                );
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
          } else {
            if (urlImage === null || urlImage === "") {
              if (requestFile === null || requestFile === undefined) {
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: null,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: url,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: urlImage,
                  }
                );
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
                await alamatService.adminUpdated(
                  req.params.userId,
                  req.params.id,
                  {
                    ...req.body,
                    gambar: url,
                  }
                );
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

  async deleteUserAddress(req, res) {
    try {
      const data = await alamatService.getAddressById(
        req.params.userId,
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
