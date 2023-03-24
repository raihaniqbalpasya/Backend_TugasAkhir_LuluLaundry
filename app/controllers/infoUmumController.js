const infoUmumService = require("../services/infoUmumService");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await infoUmumService.getAll();
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
      const data = await infoUmumService.getById(req.params.id);
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
      const data = await infoUmumService.create({
        logo: req.body.logo,
        slogan: req.body.slogan,
        lokasi: req.body.lokasi,
        koordinat: req.body.koordinat,
        noTelp: req.body.noTelp,
        fax: req.body.fax,
        email: req.body.email,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        tiktok: req.body.tiktok,
        twitter: req.body.twitter,
        youtube: req.body.youtube,
        hari: req.body.hari,
        jamMulai: req.body.jamMulai,
        jamSelesai: req.body.jamSelesai,
      });
      res.status(201).json({
        status: true,
        message: "Successfully create data",
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
      await infoUmumService.update(req.params.id, req.body);
      const data = await infoUmumService.getById(req.params.id);
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
      const data = await infoUmumService.delete(req.params.id);
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
