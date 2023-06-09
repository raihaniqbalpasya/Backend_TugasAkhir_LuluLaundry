const caraPesanService = require("../services/caraPesanService");
const { promisify } = require("util");
const cloudinary = require("../../config/cloudinary");
const cloudinaryUpload = promisify(cloudinary.uploader.upload);
const cloudinaryDelete = promisify(cloudinary.uploader.destroy);

module.exports = {
  async getAll(req, res) {
    try {
      const data = await caraPesanService.getAllData(); // Seluruh data tanpa paginasi
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
        status: true,
        message: err.message,
      });
    }
  },

  async getById(req, res) {
    try {
      const data = await caraPesanService.getById(req.params.id);
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
      if (req.body.status === "Online" || req.body.status === "Outlet") {
        if (requestFile === null || requestFile === undefined) {
          const data = await caraPesanService.create({
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
            folder: "caraPesan",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
          });
          const url = result.secure_url;
          const data = await caraPesanService.create({
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

  async update(req, res) {
    try {
      const data = await caraPesanService.getById(req.params.id);
      const requestFile = req.file;
      if (data === null) {
        res.status(404).json({
          status: false,
          message: "Data not found",
        });
      } else {
        const urlImage = data.gambar;
        if (req.body.status === "Online" || req.body.status === "Outlet") {
          if (urlImage === null || urlImage === "") {
            if (requestFile === null || requestFile === undefined) {
              await caraPesanService.update(req.params.id, {
                ...req.body,
                gambar: null,
              });
              const data = await caraPesanService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "caraPesan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await caraPesanService.update(req.params.id, {
                ...req.body,
                gambar: url,
              });
              const data = await caraPesanService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            }
          } else {
            if (requestFile === null || requestFile === undefined) {
              await caraPesanService.update(req.params.id, {
                ...req.body,
                gambar: urlImage,
              });
              const data = await caraPesanService.getById(req.params.id);
              res.status(200).json({
                status: true,
                message: "Successfully update data",
                data: data,
              });
            } else {
              // mengambil url gambar dari cloudinary dan menghapusnya
              const getPublicId =
                "caraPesan/" + urlImage.split("/").pop().split(".")[0] + "";
              await cloudinaryDelete(getPublicId);
              // upload gambar ke cloudinary
              const fileBase64 = requestFile.buffer.toString("base64");
              const file = `data:${requestFile.mimetype};base64,${fileBase64}`;
              const result = await cloudinaryUpload(file, {
                folder: "caraPesan",
                resource_type: "image",
                allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
              });
              const url = result.secure_url;
              await caraPesanService.update(req.params.id, {
                ...req.body,
                gambar: url,
              });
              const data = await caraPesanService.getById(req.params.id);
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

  async deleteById(req, res) {
    try {
      const data = await caraPesanService.getById(req.params.id);
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
            "caraPesan/" + urlImage.split("/").pop().split(".")[0] + "";
          await cloudinaryDelete(getPublicId);

          await caraPesanService.delete(req.params.id);
          res.status(200).json({
            status: true,
            message: "Successfully delete data",
          });
        } else if (urlImage === null) {
          await caraPesanService.delete(req.params.id);
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
