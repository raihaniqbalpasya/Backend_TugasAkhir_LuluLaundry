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
    hari: ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"],
    jamMulai: ["08.00", "08.00", "08.00", "08.00", "08.00", "08.00", "08.00"],
    jamSelesai: ["20.00", "20.00", "20.00", "20.00", "20.00", "20.00", "20.00"],
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
        hari: info.hari,
        jamMulai: info.jamMulai,
        jamSelesai: info.jamSelesai,
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
