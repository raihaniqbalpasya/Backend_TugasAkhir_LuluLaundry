const { JenisBarang } = require("../models");

module.exports = {
  getAll() {
    return JenisBarang.findAll();
  },

  getById(id) {
    return JenisBarang.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return JenisBarang.create(createArgs);
  },

  update(id, updateArgs) {
    return JenisBarang.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return JenisBarang.destroy({
      where: {
        id: id,
      },
    });
  },
};
