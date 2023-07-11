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
      userId: {
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      adminId: {
        references: {
          model: "Admins",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      namaLayanan: {
        type: Sequelize.STRING,
      },
      jenisLayanan: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      mPembayaran: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      statusPembayaran: {
        type: Sequelize.STRING,
        values: ["Belum Bayar", "Sudah Bayar"],
      },
      diskon: {
        type: Sequelize.INTEGER,
      },
      totalHarga: {
        type: Sequelize.INTEGER,
      },
      alamatJemput: {
        type: Sequelize.TEXT,
      },
      alamatAntar: {
        type: Sequelize.TEXT,
      },
      tglMulai: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      tenggatWaktu: {
        type: Sequelize.DATE,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        collate: "utf8_bin",
        values: [
          "Perlu Disetujui",
          "Diterima",
          "Ditolak",
          "Perlu Dijemput",
          "Perlu Dikerjakan",
          "Perlu Diantar",
          "Selesai",
          "Dibatalkan",
        ],
      },
      statusUpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      updatedBy: {
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
