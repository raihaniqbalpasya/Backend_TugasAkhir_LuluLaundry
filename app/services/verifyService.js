const { Verify } = require("../models");

module.exports = {
  getByOTP(otp) {
    try {
      return Verify.findOne({
        where: {
          otp: otp,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  create(createArgs) {
    try {
      return Verify.create(createArgs);
    } catch (error) {
      throw error;
    }
  },

  delete(otp) {
    try {
      return Verify.destroy({
        where: {
          otp: otp,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
