const { Acara } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Acara.findAll({
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
      return Acara.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Acara.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  searchEventAktif() {
    try {
      return Acara.findAll({
        where: {
          status: "Aktif",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  searchEventMendatang() {
    try {
      return Acara.findAll({
        where: {
          status: "Akan Datang",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  searchEventSelesai() {
    try {
      return Acara.findAll({
        where: {
          status: "Selesai",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return Acara.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Acara.update(updateArgs, {
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
      return Acara.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
