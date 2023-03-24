const { InfoUmum } = require("../models");

module.exports = {
  getAll() {
    return InfoUmum.findAll();
  },

  getById(id) {
    return InfoUmum.findOne({
      where: {
        id: id,
      },
    });
  },

  create(createArgs) {
    return InfoUmum.create(createArgs);
  },

  update(id, updateArgs) {
    return InfoUmum.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return InfoUmum.destroy({
      where: {
        id: id,
      },
    });
  },
};
