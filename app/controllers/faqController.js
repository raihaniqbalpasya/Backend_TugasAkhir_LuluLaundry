const faqService = require("../services/faqService");

module.exports = {
  async getAll(req, res) {
    try {
      const data = await faqService.getAll();
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
      const data = await faqService.getById(req.params.id);
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
      const data = await faqService.create({
        pertanyaan: req.body.pertanyaan,
        jawaban: req.body.jawaban,
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
      await faqService.update(req.params.id, req.body);
      const data = await faqService.getById(req.params.id);
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
      const data = await faqService.delete(req.params.id);
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
