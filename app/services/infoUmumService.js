const { InfoUmum } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return InfoUmum.findAll({
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
      return InfoUmum.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return InfoUmum.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return InfoUmum.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
