const { Review } = require("../models");

module.exports = {
  getAll(perPage, offset) {
    try {
      return Review.findAll({
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
      return Review.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Review.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(userId, createArgs) {
    try {
      return Review.create({
        ...createArgs,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  update(id, userId, updateArgs) {
    try {
      return Review.update(updateArgs, {
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  delete(id) {
    try {
      return Review.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
