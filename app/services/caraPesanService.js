const { CaraPesan } = require("../models");

module.exports = {
  getAllData() {
    try {
      return CaraPesan.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return CaraPesan.findOne({
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
      return CaraPesan.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return CaraPesan.update(updateArgs, {
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
      return CaraPesan.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
