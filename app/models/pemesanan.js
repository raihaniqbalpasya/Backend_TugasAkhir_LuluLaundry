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

      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Admin, { foreignKey: "adminId" });
      this.belongsTo(models.JenisBarang, { foreignKey: "kategoriId" });
      this.belongsTo(models.JenisLayanan, { foreignKey: "layananId" });
      this.belongsTo(models.EventPromo, { foreignKey: "promoId" });
    }
  }
  Pemesanan.init(
    {
      nomorPesanan: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      kategoriId: DataTypes.INTEGER,
      layananId: DataTypes.INTEGER,
      promoId: DataTypes.INTEGER,
      catatan: DataTypes.TEXT,
      kuantitas: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
      metodePembayaran: DataTypes.STRING,
      status: DataTypes.STRING,
      deadline: DataTypes.STRING,
      alamatJemput: DataTypes.STRING,
      alamatAntar: DataTypes.STRING,
      tglMulai: DataTypes.DATE,
      tglSelesai: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Pemesanan",
    }
  );
  return Pemesanan;
};
