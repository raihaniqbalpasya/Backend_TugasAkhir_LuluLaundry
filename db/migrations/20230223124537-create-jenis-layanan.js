"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JenisLayanans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      layanan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      hari: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      jam: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      gambar: {
        type: Sequelize.STRING,
      },
      deskripsi: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("JenisLayanans");
  },
};
