"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Review, {
        foreignKey: "pemesananId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Notifikasi, {
        foreignKey: "pemesananId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Barang, {
        foreignKey: "pemesananId",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  Pemesanan.init(
    {
      nomorPesanan: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      namaLayanan: DataTypes.STRING,
      jenisLayanan: DataTypes.ARRAY(DataTypes.INTEGER),
      mPembayaran: DataTypes.STRING,
      statusPembayaran: {
        type: DataTypes.STRING,
        values: ["Belum Bayar", "Sudah Bayar"],
      },
      diskon: DataTypes.INTEGER,
      totalHarga: DataTypes.INTEGER,
      alamatJemput: DataTypes.TEXT,
      alamatAntar: DataTypes.TEXT,
      tglMulai: DataTypes.DATE,
      tenggatWaktu: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
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
      statusUpdatedAt: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pemesanan",
    }
  );
  return Pemesanan;
};
