"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Alasan.init(
    {
      judul: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      gambar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Alasan",
    }
  );
  return Alasan;
};
