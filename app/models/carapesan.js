"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CaraPesan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.InfoBisnis, { foreignKey: "caraPesanId" });
    }
  }
  CaraPesan.init(
    {
      judul: DataTypes.STRING,
      gambar: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CaraPesan",
    }
  );
  return CaraPesan;
};
