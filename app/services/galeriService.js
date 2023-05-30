const { Galeri } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Galeri.findAll({
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
      return Galeri.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Galeri.findOne({
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
      return Galeri.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  update(id, updateArgs) {
    try {
      return Galeri.update(updateArgs, {
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
      return Galeri.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
