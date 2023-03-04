const { Admin } = require("../models");

module.exports = {
  getAll() {
    return Admin.findAll();
  },

  getById(id) {
    return Admin.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return Admin.create(createArgs);
  },

  update(id, updateArgs) {
    return Admin.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return Admin.destroy({
      where: {
        id: id,
      },
    });
  },
};
