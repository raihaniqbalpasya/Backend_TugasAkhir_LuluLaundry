const { Alasan } = require("../models");

module.exports = {
  getAll() {
    return Alasan.findAll();
  },

  getById(id) {
    return Alasan.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Alasan.create(createArgs);
  },

  update(id, updateArgs) {
    return Alasan.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Alasan.destroy({
      where: {
        id: id,
      },
    });
  },
};
