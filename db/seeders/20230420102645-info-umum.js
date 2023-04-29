"use strict";

// const InfoUmums = require("../../app/models/infoumum");
const defaultInformasi = [
  {
    logo: null,
    slogan: "Input slogan disini",
    lokasi: "Input lokasi disini",
    koordinat: "Input koordinat disini",
    noTelp: "Input nomor telepon disini",
    fax: "Input fax disini",
    email: "Input email disini",
    instagram: "Input instagram disini",
    facebook: "Input facebook disini",
    tiktok: "Input tiktok disini",
    twitter: "Input twitter disini",
    youtube: "Input youtube disini",
    jamOperasional: [
      {
        hari: "Senin",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Selasa",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Rabu",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Kamis",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Jum'at",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Sabtu",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
      {
        hari: "Minggu",
        jamMulai: "Input jam mulai disini",
        jamSelesai: "Input jam selesai disini",
      },
    ],
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const date = new Date();

    const dataInformasi = defaultInformasi.map((info) => {
      return {
        logo: info.logo,
        slogan: info.slogan,
        lokasi: info.lokasi,
        koordinat: info.koordinat,
        noTelp: info.noTelp,
        fax: info.fax,
        email: info.email,
        instagram: info.instagram,
        facebook: info.facebook,
        tiktok: info.tiktok,
        twitter: info.twitter,
        youtube: info.youtube,
        jamOperasional: JSON.stringify(info.jamOperasional),
        createdAt: date,
        updatedAt: date,
      };
    });

    await queryInterface.bulkInsert("InfoUmums", dataInformasi, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("InfoUmums", null, {});
  },
};
