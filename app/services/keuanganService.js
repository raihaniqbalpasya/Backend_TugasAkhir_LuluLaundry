const { Keuangan } = require("../models");

module.exports = {
  getAll() {
    return Keuangan.findAll();
  },

  getById(id) {
    return Keuangan.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Keuangan.create(createArgs);
  },

  update(id, updateArgs) {
    return Keuangan.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Keuangan.destroy({
      where: {
        id: id,
      },
    });
  },
};
