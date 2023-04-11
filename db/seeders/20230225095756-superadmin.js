"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const pass = "admin123";
    const password = await bcrypt.hashSync(pass, 10);
    const date = new Date();

    const Masteradmin = [
      {
        role: "master",
        nama: "Nama Masteradmin",
        password,
        email: "masteradmin@gmail.com",
        noTelp: "081234567890",
        otp: null,
        profilePic: null,
        createdAt: date,
        updatedAt: date,
      },
    ];

    await queryInterface.bulkInsert("Admins", Masteradmin, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, {});
  },
};
