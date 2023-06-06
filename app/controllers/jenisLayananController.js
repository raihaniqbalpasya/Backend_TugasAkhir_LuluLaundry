const jenisLayananService = require("../services/jenisLayananService");
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
      const data = await jenisLayananService.getAll(perPage, start); // Data yang sudah dipaginasi
      const allData = await jenisLayananService.getAllData(); // Seluruh data tanpa paginasi
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

  async getById(req, res) {
    try {
      const data = await jenisLayananService.getById(req.params.id);
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
      const requestFile = req.file;
      if (requestFile === null || requestFile === undefined) {
        if (
          (req.body.hari || req.body.jam || req.body.menit !== "") &&
          (req.body.hari || req.body.jam || req.body.menit !== null)
        ) {
          console.log(req.body.jam);
          const data = await jenisLayananService.create({
            ...req.body,
            hari: req.body.hari || 0,
            jam: req.body.jam || 0,
            menit: req.body.menit || 0,
            gambar: null,
          });
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Please input data hari or jam!",
          });
        }
      } else {
        // upload gambar ke cloudinary
        const fileBase64 = requestFile.buffer.toString("base64");
        const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
        const result = await cloudinaryUpload(file, {
          folder: "jenisLayanan",
          resource_type: "image",
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        });
        const url = result.secure_url;
        if (
          (req.body.hari || req.body.jam || req.body.menit !== "") &&
          (req.body.hari || req.body.jam || req.body.menit !== null)
        ) {
          const data = await jenisLayananService.create({
            ...req.body,
            hari: req.body.hari || 0,
            jam: req.body.jam || 0,
            menit: req.body.menit || 0,
            gambar: url,
          });
          res.status(201).json({
            status: true,
            message: "Successfully create data",
            data,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Please input data hari or jam!",
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

  async update(req, res) {
    try {
      const data = await jenisLayananService.getById(req.params.id);
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
            if (
              (req.body.hari || req.body.jam || req.body.menit !== "") &&
              (req.body.hari || req.body.jam || req.body.menit !== null)
            ) {
              await jenisLayananService.update(req.params.id, {
                ...req.body,
                hari: req.body.hari || 0,
                jam: req.body.jam || 0,
                menit: req.body.menit || 0,
                gambar: null,
              });
              const data = await jenisLayananService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              res.status(404).json({
                status: false,
                message: "Please input data hari or jam!",
              });
            }
          } else {
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "jenisLayanan",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            if (
              (req.body.hari || req.body.jam || req.body.menit !== "") &&
              (req.body.hari || req.body.jam || req.body.menit !== null)
            ) {
              await jenisLayananService.update(req.params.id, {
                ...req.body,
                hari: req.body.hari || 0,
                jam: req.body.jam || 0,
                menit: req.body.menit || 0,
                gambar: url,
              });
              const data = await jenisLayananService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              res.status(404).json({
                status: false,
                message: "Please input data hari or jam!",
              });
            }
          }
        } else {
          if (requestFile === null || requestFile === undefined) {
            if (
              (req.body.hari || req.body.jam || req.body.menit !== "") &&
              (req.body.hari || req.body.jam || req.body.menit !== null)
            ) {
              await jenisLayananService.update(req.params.id, {
                ...req.body,
                hari: req.body.hari || 0,
                jam: req.body.jam || 0,
                menit: req.body.menit || 0,
                gambar: urlImage,
              });
              const data = await jenisLayananService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              res.status(404).json({
                status: false,
                message: "Please input data hari or jam!",
              });
            }
          } else {
            // mengambil url gambar dari cloudinary dan menghapusnya
            const getPublicId =
              "jenisLayanan/" + urlImage.split("/").pop().split(".")[0] + "";
            await cloudinaryDelete(getPublicId);
            // upload gambar ke cloudinary
            const fileBase64 = requestFile.buffer.toString("base64");
            const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
            const result = await cloudinaryUpload(file, {
              folder: "jenisLayanan",
              resource_type: "image",
              allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
            });
            const url = result.secure_url;
            if (
              (req.body.hari || req.body.jam || req.body.menit !== "") &&
              (req.body.hari || req.body.jam || req.body.menit !== null)
            ) {
              await jenisLayananService.update(req.params.id, {
                ...req.body,
                hari: req.body.hari || 0,
                jam: req.body.jam || 0,
                menit: req.body.menit || 0,
                gambar: url,
              });
              const data = await jenisLayananService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              res.status(404).json({
                status: false,
                message: "Please input data hari or jam!",
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

  async deleteById(req, res) {
    try {
      const data = await jenisLayananService.getById(req.params.id);
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
            "jenisLayanan/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await jenisLayananService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await jenisLayananService.delete(req.params.id);
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
