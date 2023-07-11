const jenisLayananService = require("../services/jenisLayananService");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

module.exports = {
  async getAll(req, res) {
    try {
      const data = await jenisLayananService.getAllData(); // Seluruh data tanpa paginasi
      // Respon yang akan ditampilkan jika datanya ada
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
          res.status(400).json({
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
          res.status(400).json({
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
              res.status(400).json({
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
              res.status(400).json({
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
              res.status(400).json({
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
              res.status(400).json({
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
