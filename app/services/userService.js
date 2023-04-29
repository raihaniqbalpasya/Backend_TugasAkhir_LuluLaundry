const { User } = require("../models");

module.exports = {
  async getAllUser() {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return User.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByPhone(noTelp) {
    try {
      return User.findOne({
        where: {
          noTelp: noTelp,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return User.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return User.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  delete(id) {
    try {
      return User.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
