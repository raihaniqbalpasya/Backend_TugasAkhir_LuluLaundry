const { JenisLaundry } = require("../models");

module.exports = {
  getAll() {
    return JenisLaundry.findAll();
  },

  getById(id) {
    return JenisLaundry.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return JenisLaundry.create(createArgs);
  },

  update(id, updateArgs) {
    return JenisLaundry.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return JenisLaundry.destroy({
      where: {
        id: id,
      },
    });
  },
};
