"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Alamats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      kategori: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      detail: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kecamatan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      kelurahan: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rt: {
        type: Sequelize.STRING,
      },
      rw: {
        type: Sequelize.STRING,
      },
      deskripsi: {
        type: Sequelize.STRING,
      },
      gambar: {
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        values: ["priority", "standard"],
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
    await queryInterface.dropTable("Alamats");
  },
};
