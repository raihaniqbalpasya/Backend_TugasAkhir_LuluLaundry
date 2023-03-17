"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Acaras", {
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
      nama: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      gambar: {
        type: Sequelize.STRING,
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      kriteria: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      reward: {
        allowNull: false,
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      jumlah: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Acaras");
  },
};
