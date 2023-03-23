const { Galeri } = require("../models");

module.exports = {
  getAll() {
    return Galeri.findAll();
  },

  getById(id) {
    return Galeri.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Galeri.create(createArgs);
  },

  update(id, updateArgs) {
    return Galeri.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Galeri.destroy({
      where: {
        id: id,
      },
    });
  },
};
