const { Admin } = require("../models");

module.exports = {
  async getAll() {
    try {
      return Admin.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Admin.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByName(nama) {
    try {
      return Admin.findOne({
        where: {
          nama: nama,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return Admin.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Admin.update(updateArgs, {
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
      return Admin.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
