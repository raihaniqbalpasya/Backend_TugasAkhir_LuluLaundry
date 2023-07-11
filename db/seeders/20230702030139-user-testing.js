"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pass = "coba123";
    const password = await bcrypt.hashSync(pass, 10);
    const date = new Date();

    const UserTest = [
      {
        nama: "coba",
        password,
        email: "coba@gmail.com",
        noTelp: "6281234567890",
        otp: null,
        tglLahir: null,
        alamatUser: null,
        profilePic: null,
        totalOrder: 0,
        status: "Full Access",
        createdAt: date,
        updatedAt: date,
      },
    ];

    await queryInterface.bulkInsert("Users", UserTest, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
