"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Keuangan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  Keuangan.init(
    {
      adminId: DataTypes.INTEGER,
      tipe: {
        type: DataTypes.STRING,
        values: ["Pemasukan", "Pengeluaran", "Transaksi Pemesanan"],
      },
      nominal: DataTypes.INTEGER,
      judul: DataTypes.STRING,
      catatan: DataTypes.TEXT,
      tanggal: DataTypes.DATE,
      gambar: DataTypes.STRING,
      createdBy: DataTypes.STRING,
      updatedBy: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Keuangan",
    }
  );
  return Keuangan;
};
