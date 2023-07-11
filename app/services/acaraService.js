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

  searchActiveEvent() {
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

  searchUpcomingEvent() {
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

  searchDoneAndDisabledEvent() {
    try {
      return Acara.findAll({
        where: {
          [Op.or]: [
            {
              status: "Selesai",
            },
            {
              status: "Nonaktif",
            },
          ],
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

  updateUpcomingStatus() {
    try {
      return Acara.update(
        { status: "Akan Datang" },
        {
          where: {
            [Op.and]: [
              { tglMulai: { [Op.gt]: new Date() } },
              { status: { [Op.ne]: "Nonaktif" } },
            ],
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updateActiveStatus() {
    try {
      return Acara.update(
        { status: "Aktif" },
        {
          where: {
            [Op.and]: [
              { tglMulai: { [Op.lt]: new Date() } },
              { tglSelesai: { [Op.gt]: new Date() } },
              { status: { [Op.ne]: "Nonaktif" } },
            ],
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updateDoneStatus() {
    try {
      return Acara.update(
        { status: "Selesai" },
        {
          where: {
            [Op.and]: [
              { tglSelesai: { [Op.lt]: new Date() } },
              { status: { [Op.ne]: "Nonaktif" } },
            ],
          },
        }
      );
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
