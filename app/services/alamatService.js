const { Alamat, User } = require("../models");

module.exports = {
  // for alamat controller
  getAll(perPage, offset) {
    try {
      return Alamat.findAll({
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
      return Alamat.findAll();
    } catch (error) {
      throw error;
    }
  },

  getById(id) {
    try {
      return Alamat.findOne({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  deleteById(id) {
    try {
      return Alamat.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // for admin controller
  adminCreated(userId, createArgs) {
    try {
      return Alamat.create({
        ...createArgs,
        userId,
      });
    } catch (error) {
      throw error;
    }
  },

  adminUpdated(userId, id, updateArgs) {
    try {
      return Alamat.update(updateArgs, {
        where: {
          userId: userId,
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  adminDeleted(userId) {
    try {
      return Alamat.destroy({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // for user controller
  getAllAddress(userId) {
    try {
      return Alamat.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: User,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },

  getAddressById(userId, id) {
    try {
      return Alamat.findOne({
        where: {
          userId: userId,
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  createAddress(userId, createArgs) {
    try {
      return Alamat.create({
        ...createArgs,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  },

  updateAllAddress(userId) {
    try {
      return Alamat.update(
        {
          status: "Standard",
        },
        {
          where: {
            userId: userId,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updateAddressPriority(id, userId) {
    try {
      return Alamat.update(
        { status: "Priority" },
        {
          where: {
            id: id,
            userId: userId,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updateAddressStandard(id, userId) {
    try {
      return Alamat.update(
        { status: "Standard" },
        {
          where: {
            id: id,
            userId: userId,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  updateAddress(id, userId, updateArgs) {
    try {
      return Alamat.update(updateArgs, {
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  deleteAddress(id, userId) {
    try {
      return Alamat.destroy({
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  deleteAddressAll(userId) {
    try {
      return Alamat.destroy({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
