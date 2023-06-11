const { Barang, Pemesanan } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Barang.findAll({
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
      return Barang.findAll();
    } catch (error) {
      throw error;
    }
  },

  getAllByPemesananId(pemesananId) {
    try {
      return Barang.findAll({
        where: {
          pemesananId: pemesananId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Barang.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Pemesanan,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return Barang.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  createByUser(userId, createArgs) {
    try {
      return Barang.create({
        ...createArgs,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Barang.update(updateArgs, {
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  updateByUser(id, userId, updateArgs) {
    try {
      return Barang.update(
        {
          ...updateArgs,
          userId: userId,
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
      return Barang.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  deleteByUser(id, userId) {
    try {
      return Barang.destroy({
        where: {
          id: id,
        },
        include: [
          {
            model: Pemesanan,
            where: {
              userId: userId,
            },
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },
};
