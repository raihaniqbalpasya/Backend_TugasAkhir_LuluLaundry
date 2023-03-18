const { Acara } = require("../models");

module.exports = {
  getAll() {
    return Acara.findAll();
  },

  getById(id) {
    return Acara.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Acara.create(createArgs);
  },

  update(id, updateArgs) {
    return Acara.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Acara.destroy({
      where: {
        id: id,
      },
    });
  },
};
