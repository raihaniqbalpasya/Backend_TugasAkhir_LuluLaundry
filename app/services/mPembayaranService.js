const { MPembayaran } = require("../models");

module.exports = {
  getAll() {
    return MPembayaran.findAll();
  },

  getById(id) {
    return MPembayaran.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return MPembayaran.create(createArgs);
  },

  update(id, updateArgs) {
    return MPembayaran.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return MPembayaran.destroy({
      where: {
        id: id,
      },
    });
  },
};
