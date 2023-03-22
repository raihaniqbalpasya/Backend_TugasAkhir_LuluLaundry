const { About } = require("../models");

module.exports = {
  getAll() {
    return About.findAll();
  },

  getById(id) {
    return About.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return About.create(createArgs);
  },

  update(id, updateArgs) {
    return About.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return About.destroy({
      where: {
        id: id,
      },
    });
  },
};
