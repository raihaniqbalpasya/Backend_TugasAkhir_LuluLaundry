const { JenisLayanan } = require("../models");

module.exports = {
  getAllData() {
    try {
      return JenisLayanan.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return JenisLayanan.findOne({
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
      return JenisLayanan.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return JenisLayanan.update(updateArgs, {
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
      return JenisLayanan.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
