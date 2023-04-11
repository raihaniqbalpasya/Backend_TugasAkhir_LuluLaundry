const { Admin } = require("../models");

module.exports = {
  async getAll() {
    try {
      return Admin.findAll();
    } catch (err) {
      throw err;
    }
  },

  getById(id) {
    return Admin.findOne({
      where: {
        id: id,
      },
    });
  },

  getByName(nama) {
    return Admin.findOne({
      where: {
        nama: nama,
      },
    });
  },

  create(createArgs) {
    return Admin.create(createArgs);
  },

  update(id, updateArgs) {
    return Admin.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Admin.destroy({
      where: {
        id: id,
      },
    });
  },
};
