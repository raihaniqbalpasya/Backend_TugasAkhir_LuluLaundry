const { Pemesanan, Admin, User } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Pemesanan.findAll({
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
      return Pemesanan.findAll();
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
          },
          {
            model: User,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  createByUser(userId, createArgs) {
    try {
      return Pemesanan.create({
        ...createArgs,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  createByAdmin(adminId, createArgs) {
    try {
      return Pemesanan.create({
        ...createArgs,
        adminId: adminId,
      });
    } catch (error) {
      throw error;
    }
  },

  updateByUser(id, userId, updateArgs) {
    try {
      return Pemesanan.update(updateArgs, {
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  updateByAdmin(id, adminId, updateArgs) {
    try {
      return Pemesanan.update(updateArgs, {
        where: {
          id: id,
          adminId: adminId,
          // $or: [{ createdBy: "user" }, { createdBy: "admin" }],
        },
      });
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
