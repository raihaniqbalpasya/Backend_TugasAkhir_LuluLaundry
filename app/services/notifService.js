const { Op } = require("sequelize");
const { Notifikasi, Pemesanan, User, sequelize } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Notifikasi.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        include: [
          {
            model: Pemesanan,
            as: "pemesanan",
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByAdminNoPag() {
    try {
      return Notifikasi.findAll({
        where: {
          createdBy: "user",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByAdmin(perPage, offset) {
    try {
      return Notifikasi.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        where: {
          createdBy: "user",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByUserIdNoPag(userId) {
    try {
      return Notifikasi.findAll({
        include: [
          { model: Pemesanan, as: "pemesanan", where: { userId: userId } },
        ],
        where: {
          createdBy: "admin",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByUserId(perPage, offset, userId) {
    try {
      return Notifikasi.findAll({
        include: [
          { model: Pemesanan, as: "pemesanan", where: { userId: userId } },
        ],
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        where: {
          createdBy: "admin",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllData() {
    try {
      return Notifikasi.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Notifikasi.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return Notifikasi.create({
        ...createArgs,
        dibacaAdmin: false,
        dibacaUser: false,
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Notifikasi.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  readAllByUser(userId) {
    try {
      return Notifikasi.update(
        { dibacaUser: true },
        {
          where: {
            createdBy: "admin",
          },
          include: [
            {
              model: Pemesanan,
              as: "pemesanan",
              where: {
                userId: userId,
              },
            },
          ],
        }
      );
    } catch (error) {
      throw error;
    }
  },

  readAllByAdmin() {
    try {
      return Notifikasi.update(
        { dibacaAdmin: true },
        {
          where: {
            dibacaAdmin: false,
            createdBy: "admin",
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  delete(id) {
    try {
      return Notifikasi.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
