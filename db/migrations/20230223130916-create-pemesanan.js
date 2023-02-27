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
        allowNull: false,
        references: {
          model: "Admins",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      kategoriId: {
        allowNull: false,
        references: {
          model: "JenisBarangs",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      layananId: {
        allowNull: false,
        references: {
          model: "JenisLayanans",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      promoId: {
        allowNull: false,
        references: {
          model: "EventPromos",
          key: "id",
        },
        type: Sequelize.INTEGER,
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
      metodePembayaran: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      deadline: {
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
      tglSelesai: {
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
    await queryInterface.dropTable("Pemesanans");
  },
};
