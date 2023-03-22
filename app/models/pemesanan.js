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
      this.hasMany(models.Review, { foreignKey: "pemesananId" });
      this.hasOne(models.Notifikasi, { foreignKey: "pemesananId" });

      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Admin, { foreignKey: "adminId" });
      this.belongsTo(models.JenisLaundry, { foreignKey: "laundryId" });
      this.belongsTo(models.JenisLayanan, { foreignKey: "layananId" });
      this.belongsTo(models.Acara, { foreignKey: "acaraId" });
      this.belongsTo(models.MPembayaran, { foreignKey: "pembayaranId" });
    }
  }
  Pemesanan.init(
    {
      nomorPesanan: DataTypes.STRING,
      namaBarang: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      laundryId: DataTypes.INTEGER,
      layananId: DataTypes.INTEGER,
      acaraId: DataTypes.INTEGER,
      pembayaranId: DataTypes.INTEGER,
      catatan: DataTypes.TEXT,
      kuantitas: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
      diskon: DataTypes.INTEGER,
      status: DataTypes.STRING,
      alamatJemput: DataTypes.STRING,
      alamatAntar: DataTypes.STRING,
      tglMulai: DataTypes.DATE,
      gambar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pemesanan",
    }
  );
  return Pemesanan;
};
