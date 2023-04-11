"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisLaundry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JenisLaundry.init(
    {
      nama: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      gambar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "JenisLaundry",
    }
  );
  return JenisLaundry;
};
