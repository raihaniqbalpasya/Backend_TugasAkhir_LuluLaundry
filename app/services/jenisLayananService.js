const { JenisLayanan } = require("../models");

module.exports = {
  getAll() {
    return JenisLayanan.findAll();
  },

  getById(id) {
    return JenisLayanan.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return JenisLayanan.create(createArgs);
  },

  update(id, updateArgs) {
    return JenisLayanan.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return JenisLayanan.destroy({
      where: {
        id: id,
      },
    });
  },
};
