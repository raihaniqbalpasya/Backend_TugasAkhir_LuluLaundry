const { Alamat } = require("../models");

module.exports = {
  getAll() {
    return Alamat.findAll();
  },

  getById(id) {
    return Alamat.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Alamat.create(createArgs);
  },

  update(id, updateArgs) {
    return Alamat.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Alamat.destroy({
      where: {
        id: id,
      },
    });
  },
};
