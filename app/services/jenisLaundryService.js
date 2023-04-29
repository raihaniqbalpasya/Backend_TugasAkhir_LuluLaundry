const { JenisLaundry } = require("../models");

module.exports = {
  getAll() {
    try {
      return JenisLaundry.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return JenisLaundry.findOne({
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
      return JenisLaundry.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return JenisLaundry.update(updateArgs, {
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
      return JenisLaundry.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
