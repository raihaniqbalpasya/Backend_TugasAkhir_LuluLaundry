"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notifikasis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pemesananId: {
        allowNull: false,
        references: {
          model: "Pemesanans",
          key: "id",
        },
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
      },
      pesan: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      dibacaAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      dibacaUser: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      createdBy: {
        allowNull: false,
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
    await queryInterface.dropTable("Notifikasis");
  },
};
