"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Keuangans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      adminId: {
        allowNull: false,
        references: {
          model: "Admins",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      tipe: {
        allowNull: false,
        type: Sequelize.STRING,
        values: ["pemasukan", "pengeluaran"],
      },
      nominal: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      judul: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      catatan: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      tanggal: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Keuangans");
  },
};
