"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InfoUmums", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      logo: {
        type: Sequelize.STRING,
      },
      slogan: {
        type: Sequelize.STRING,
      },
      lokasi: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      koordinat: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      noTelp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fax: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      instagram: {
        type: Sequelize.STRING,
      },
      facebook: {
        type: Sequelize.STRING,
      },
      tiktok: {
        type: Sequelize.STRING,
      },
      twitter: {
        type: Sequelize.STRING,
      },
      youtube: {
        type: Sequelize.STRING,
      },
      hari: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      jamMulai: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      jamSelesai: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable("InfoUmums");
  },
};
