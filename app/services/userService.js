const { User } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll(perPage, offset) {
    try {
      return User.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        attributes: {
          exclude: ["password", "otp"],
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllData() {
    try {
      return User.findAll();
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
        attributes: {
          exclude: ["password", "otp"],
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

  searchUser(nama, noTelp) {
    try {
      return User.findAll({
        where: {
          [Op.or]: [
            {
              nama: {
                [Op.iLike]: `%${nama}%`,
              },
            },
            {
              noTelp: {
                [Op.like]: `%${noTelp}%`,
              },
            },
          ],
        },
        attributes: {
          exclude: ["password", "otp"],
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
