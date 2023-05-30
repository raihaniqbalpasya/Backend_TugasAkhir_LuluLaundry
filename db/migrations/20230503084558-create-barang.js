"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Barangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pemesananId: {
        references: {
          model: "Pemesanans",
          key: "id",
        },
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
      },
      namaBarang: {
        type: Sequelize.STRING,
      },
      jenisLaundry: {
        type: Sequelize.STRING,
      },
      kuantitas: {
        type: Sequelize.INTEGER,
      },
      harga: {
        type: Sequelize.INTEGER,
      },
      jumlah: {
        type: Sequelize.INTEGER,
      },
      catatan: {
        type: Sequelize.STRING,
      },
      gambar: {
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
    await queryInterface.dropTable("Barangs");
  },
};
