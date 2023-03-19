"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InfoUmum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.InfoBisnis, { foreignKey: "infoUmumId" });
    }
  }
  InfoUmum.init(
    {
      logo: DataTypes.STRING,
      slogan: DataTypes.STRING,
      lokasi: DataTypes.STRING,
      koordinat: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      fax: DataTypes.STRING,
      email: DataTypes.STRING,
      instagram: DataTypes.STRING,
      facebook: DataTypes.STRING,
      tiktok: DataTypes.STRING,
      twitter: DataTypes.STRING,
      youtube: DataTypes.STRING,
      hari: DataTypes.STRING,
      jamMulai: DataTypes.STRING,
      jamSelesai: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "InfoUmum",
    }
  );
  return InfoUmum;
};