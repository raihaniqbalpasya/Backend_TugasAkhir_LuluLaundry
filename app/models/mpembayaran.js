"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MPembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pemesanan, { foreignKey: "pembayaranId" });
      this.hasMany(models.InfoBisnis, { foreignKey: "pembayaranId" });
    }
  }
  MPembayaran.init(
    {
      logo: DataTypes.STRING,
      nama: DataTypes.STRING,
      nomor: DataTypes.STRING,
      instruksi: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "MPembayaran",
    }
  );
  return MPembayaran;
};
