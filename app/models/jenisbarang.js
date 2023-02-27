"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pemesanan, { foreignKey: "kategoriId" });
    }
  }
  JenisBarang.init(
    {
      kategori: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "JenisBarang",
    }
  );
  return JenisBarang;
};
