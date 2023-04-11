"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pemesanans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomorPesanan: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      namaBarang: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
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
      jenisLaundry: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      jenisLayanan: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      acara: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mPembayaran: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      catatan: {
        type: Sequelize.TEXT,
      },
      kuantitas: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      harga: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      diskon: {
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      alamatJemput: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      alamatAntar: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      tglMulai: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Pemesanans");
  },
};
