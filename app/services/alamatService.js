const { Alamat } = require("../models");

module.exports = {
  // for alamat controller
  async getAll() {
    try {
      return await Alamat.findAll();
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      return await Alamat.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteById(id) {
    try {
      return await Alamat.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // for admin controller
  async adminCreated(userId, createArgs) {
    try {
      return await Alamat.create({
        ...createArgs,
        userId,
      });
    } catch (error) {
      throw error;
    }
  },

  async adminUpdated(userId, id, updateArgs) {
    try {
      return await Alamat.update(updateArgs, {
        where: {
          userId: userId,
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async adminDeleted(userId) {
    try {
      return await Alamat.destroy({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // for user controller
  async getAllAddress(userId) {
    try {
      return await Alamat.findAll({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async getAddressById(userId, id) {
    try {
      return await Alamat.findOne({
        where: {
          userId: userId,
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async createAddress(userId, createArgs) {
    try {
      return await Alamat.create({
        ...createArgs,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  async updateAddress(id, userId, updateArgs) {
    try {
      return await Alamat.update(updateArgs, {
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteAddress(id, userId) {
    try {
      return await Alamat.destroy({
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteAddressAll(userId) {
    try {
      return await Alamat.destroy({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
