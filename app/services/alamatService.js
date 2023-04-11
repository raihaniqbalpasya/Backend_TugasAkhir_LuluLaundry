const { Alamat } = require("../models");

module.exports = {
  // for alamat controller
  async getAll() {
    try {
      return await Alamat.findAll();
    } catch (err) {
      throw err;
    }
  },

  async getById(id) {
    try {
      return await Alamat.findOne({
        where: {
          id: id,
        },
      });
    } catch (err) {
      throw err;
    }
  },

  // for admin controller
  async adminCreated(createArgs, userId) {
    try {
      return await Alamat.create({
        ...createArgs,
        userId,
        status: "priority",
      });
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    }
  },

  async adminDeleted(userId) {
    try {
      return await Alamat.destroy({
        where: {
          userId,
        },
      });
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    }
  },

  async createAddress(createArgs, userId) {
    try {
      return await Alamat.create({
        ...createArgs,
        userId,
      });
    } catch (err) {
      throw err;
    }
  },

  async updateAddress(id, updateArgs, userId) {
    try {
      return await Alamat.update(updateArgs, {
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    }
  },

  async deleteAddressAll(userId) {
    try {
      return await Alamat.destroy({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      throw err;
    }
  },
};
