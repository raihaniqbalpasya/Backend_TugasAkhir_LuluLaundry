const jenisLayananService = require("../services/jenisLayananService");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await jenisLayananService.getAll();
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
      if (req.body.hari || req.body.jam !== null) {
        const data = await jenisLayananService.create({
          layanan: req.body.layanan,
          hari: req.body.hari,
          jam: req.body.jam,
          gambar: req.body.gambar,
          deskripsi: req.body.deskripsi,
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
    } catch (err) {
      res.status(422).json({
        status: false,
        message: err.message,
      });
    }
  },

  async update(req, res) {
    try {
      if (req.body.hari || req.body.jam !== null) {
        await jenisLayananService.update(req.params.id, req.body);
        const data = await jenisLayananService.getById(req.params.id);
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
      } else {
        res.status(404).json({
          status: false,
          message: "Please input data hari or jam!",
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
      const data = await jenisLayananService.delete(req.params.id);
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
