const { FAQ } = require("../models");

module.exports = {
  getAll() {
    return FAQ.findAll();
  },

  getById(id) {
    return FAQ.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return FAQ.create(createArgs);
  },

  update(id, updateArgs) {
    return FAQ.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return FAQ.destroy({
      where: {
        id: id,
      },
    });
  },
};
