const reviewService = require("../services/reviewService");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

module.exports = {
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
      const data = await reviewService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await reviewService.getAllData(); // Seluruh data tanpa paginasi
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
        status: false,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await reviewService.getById(req.params.id);
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

  async getByPemesananId(req, res) {
    try {
      const data = await reviewService.getByPemesananId(req.params.pemesananId);
      if (data.length >= 1) {
        res.status(200).json({
          status: true,
          message: "Successfully get data by pemesananId",
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
      if (req.body.rating >= 0 && req.body.rating <= 5) {
        if (requestFile === null || requestFile === undefined) {
          const data = await reviewService.create(req.user.id, {
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
            folder: "review",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await reviewService.create(req.user.id, {
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
        res.status(422).json({
          status: false,
          message: "Rating must be between 0 and 5",
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
      const data = await reviewService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (req.body.rating >= 0 && req.body.rating <= 5) {
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await reviewService.update(req.params.id, req.user.id, {
                ...req.body,
                pemesananId: data.pemesananId,
                gambar: null,
              });
              const print = await reviewService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "review",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await reviewService.update(req.params.id, req.user.id, {
                ...req.body,
                pemesananId: data.pemesananId,
                gambar: url,
              });
              const print = await reviewService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await reviewService.update(req.params.id, req.user.id, {
                ...req.body,
                pemesananId: data.pemesananId,
                gambar: urlImage,
              });
              const print = await reviewService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "review/" + urlImage.split("/").pop().split(".")[0] + "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "review",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await reviewService.update(req.params.id, req.user.id, {
                ...req.body,
                pemesananId: data.pemesananId,
                gambar: url,
              });
              const print = await reviewService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: print,
              });
            }
          }
        } else {
          res.status(422).json({
            status: false,
            message: "Rating must be between 0 and 5",
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
      const data = await reviewService.getById(req.params.id);
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
            "review/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await reviewService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await reviewService.delete(req.params.id);
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
};
