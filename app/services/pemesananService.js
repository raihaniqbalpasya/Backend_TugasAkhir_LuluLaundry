const { Pemesanan, Admin, User } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAllData() {
    try {
      return Pemesanan.findAll();
    } catch (error) {
      throw error;
    }
  },

  getAll(perPage, offset) {
    try {
      return Pemesanan.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  getAllDataByStatus(status) {
    try {
      return Pemesanan.findAll({
        where: {
          status: {
            [Op.like]: status,
          },
        },
        collate: "utf8_bin",
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByStatus(perPage, offset, status) {
    try {
      return Pemesanan.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
        where: {
          status: {
            [Op.like]: status,
          },
        },
        collate: "utf8_bin",
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByUserId(userId) {
    try {
      return Pemesanan.findAll({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getAllByUserIdPagination(perPage, offset, userId) {
    try {
      return Pemesanan.findAll({
        order: [
          ["updatedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit: perPage,
        offset: offset,
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Pemesanan.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Admin,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  getByNomorPesanan(nomorPesanan) {
    try {
      return Pemesanan.findOne({
        where: {
          nomorPesanan: nomorPesanan,
        },
        include: [
          {
            model: Admin,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  getByNomorPesananFromUser(userId, nomorPesanan) {
    try {
      return Pemesanan.findOne({
        where: {
          userId: userId,
          nomorPesanan: nomorPesanan,
        },
        include: [
          {
            model: Admin,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
          {
            model: User,
            attributes: {
              exclude: ["password", "otp"],
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  searchOrder(nomorPesanan) {
    try {
      return Pemesanan.findAll({
        where: {
          [Op.or]: [
            {
              nomorPesanan: {
                [Op.iLike]: `%${nomorPesanan}%`,
              },
            },
          ],
        },
      });
    } catch (error) {
      throw error;
    }
  },

  createByUser(userId, userName, createArgs) {
    try {
      return Pemesanan.create({
        ...createArgs,
        userId: userId,
        createdBy: userName,
      });
    } catch (error) {
      throw error;
    }
  },

  createByAdmin(adminId, adminName, createArgs) {
    try {
      return Pemesanan.create({
        ...createArgs,
        adminId: adminId,
        createdBy: adminName,
      });
    } catch (error) {
      throw error;
    }
  },

  updateByUser(id, userId, userName, updateArgs) {
    try {
      return Pemesanan.update(
        {
          ...updateArgs,
          userId: userId,
          updatedBy: userName,
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

  updateByAdmin(id, adminId, adminName, updateArgs) {
    try {
      return Pemesanan.update(
        {
          ...updateArgs,
          adminId: adminId,
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
      return Pemesanan.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
