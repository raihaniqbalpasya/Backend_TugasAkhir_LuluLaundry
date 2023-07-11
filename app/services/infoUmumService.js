const { InfoUmum } = require("../models");

module.exports = {
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
