const { FAQ } = require("../models");

module.exports = {
  getAllData() {
    try {
      return FAQ.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return FAQ.findOne({
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
      return FAQ.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return FAQ.update(updateArgs, {
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
      return FAQ.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
