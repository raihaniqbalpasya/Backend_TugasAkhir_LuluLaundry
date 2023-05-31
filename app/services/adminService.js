const { Admin } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Admin.findAll({
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
      return Admin.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Admin.findOne({
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

  getByIdAll(id) {
    try {
      return Admin.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getByName(nama) {
    try {
      return Admin.findOne({
        where: {
          nama: nama,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  searchAdmin(nama, noTelp) {
    try {
      return Admin.findAll({
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

  create(adminName, createArgs) {
    try {
      return Admin.create({
        ...createArgs,
        createdBy: adminName,
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, adminName, updateArgs) {
    try {
      return Admin.update(
        {
          ...updateArgs,
          updatedBy: adminName,
        },
        {
          where: {
            id: id,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  delete(id) {
    try {
      return Admin.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
