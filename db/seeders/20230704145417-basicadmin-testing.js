"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pass = "basic123";
    const password = await bcrypt.hashSync(pass, 10);
    const date = new Date();

    const Basicadmin = [
      {
        role: "Basic",
        nama: "Admin Basic",
        password,
        email: "basicadmin@gmail.com",
        noTelp: "081122334455",
        otp: null,
        profilePic: null,
        createdBy: "Basicadmin",
        updatedBy: "Basicadmin",
        status: "Aktif",
        createdAt: date,
        updatedAt: date,
      },
    ];

    await queryInterface.bulkInsert("Admins", Basicadmin, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, {});
  },
};
