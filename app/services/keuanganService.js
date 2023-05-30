const { Keuangan } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Keuangan.findAll({
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
      return Keuangan.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Keuangan.findOne({
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
      return Keuangan.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Keuangan.update(updateArgs, {
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
      return Keuangan.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
