const { CaraPesan } = require("../models");

module.exports = {
  getAll() {
    return CaraPesan.findAll();
  },

  getById(id) {
    return CaraPesan.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return CaraPesan.create(createArgs);
  },

  update(id, updateArgs) {
    return CaraPesan.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return CaraPesan.destroy({
      where: {
        id: id,
      },
    });
  },
};
