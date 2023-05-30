const { Keuangan } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Keuangan.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
      });
    } catch (error) {
      throw error;
    }
  },

  getAllData() {
    try {
      return Keuangan.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Keuangan.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  searchFinance(judul) {
    try {
      return Keuangan.findAll({
        where: {
          [Op.or]: [
            {
              judul: {
                [Op.iLike]: `%${judul}%`,
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
      return Keuangan.create({
        ...createArgs,
        createdBy: adminName,
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Keuangan.update(updateArgs, {
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
      return Keuangan.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
