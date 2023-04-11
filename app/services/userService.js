const { User } = require("../models");

module.exports = {
  async getAllUser() {
    try {
      return await User.findAll();
    } catch (err) {
      throw err;
    }
  },

  getById(id) {
    return User.findOne({
      where: {
        id: id,
      },
    });
  },

  getByPhone(noTelp) {
    return User.findOne({
      where: {
        noTelp: noTelp,
      },
    });
  },

  create(createArgs) {
    return User.create(createArgs);
  },

  update(id, updateArgs) {
    return User.update(updateArgs, {
      where: {
        id: id,
      },
    });
  },

  delete(id) {
    return User.destroy({
      where: {
        id: id,
      },
    });
  },
};
