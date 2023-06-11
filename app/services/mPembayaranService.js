const { MPembayaran } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return MPembayaran.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
      });
    } catch (error) {
      throw error;
    }
  },

  getAllData() {
    try {
      return MPembayaran.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return MPembayaran.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return MPembayaran.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return MPembayaran.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  delete(id) {
    try {
      return MPembayaran.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
