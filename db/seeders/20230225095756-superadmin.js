"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const pass = "admin123";
    const password = await bcrypt.hashSync(pass, 10);
    const date = new Date();

    const Superadmin = [
      {
        role: "superadmin",
        nama: "Nama Superadmin",
        password,
        email: "superadmin@gmail.com",
        noTelp: "081234567890",
        otp: null,
        alamat: "Jl.Superadmin Kec.Purwokerto Utara",
        profilePic: null,
        createdAt: date,
        updatedAt: date,
      },
    ];

    await queryInterface.bulkInsert("Admins", Superadmin, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, {});
  },
};
