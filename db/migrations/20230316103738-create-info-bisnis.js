"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("InfoBisnis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      infoUmumId: {
        allowNull: false,
        references: {
          model: "InfoUmums",
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
      laundryId: {
        allowNull: false,
        references: {
          model: "JenisLaundries",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      alasanId: {
        allowNull: false,
        references: {
          model: "Alasans",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      aboutId: {
        allowNull: false,
        references: {
          model: "Abouts",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      caraPesanId: {
        allowNull: false,
        references: {
          model: "CaraPesans",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      galeriId: {
        allowNull: false,
        references: {
          model: "Galeris",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      faqId: {
        allowNull: false,
        references: {
          model: "FAQs",
          key: "id",
        },
        type: Sequelize.INTEGER,
      },
      pembayaranId: {
        allowNull: false,
        references: {
          model: "MPembayarans",
          key: "id",
        },
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("InfoBisnis");
  },
};
