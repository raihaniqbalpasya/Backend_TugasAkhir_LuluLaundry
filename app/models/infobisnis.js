"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InfoBisnis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.InfoUmum, { foreignKey: "infoUmumId" });
      this.belongsTo(models.JenisLayanan, { foreignKey: "layananId" });
      this.belongsTo(models.JenisLaundry, { foreignKey: "laundryId" });
      this.belongsTo(models.Alasan, { foreignKey: "alasanId" });
      this.belongsTo(models.About, { foreignKey: "aboutId" });
      this.belongsTo(models.CaraPesan, { foreignKey: "caraPesanId" });
      this.belongsTo(models.Galeri, { foreignKey: "galeriId" });
      this.belongsTo(models.FAQ, { foreignKey: "faqId" });
      this.belongsTo(models.MPembayaran, { foreignKey: "pembayaranId" });
    }
  }
  InfoBisnis.init(
    {
      infoUmumId: DataTypes.INTEGER,
      layananId: DataTypes.INTEGER,
      laundryId: DataTypes.INTEGER,
      alasanId: DataTypes.INTEGER,
      aboutId: DataTypes.INTEGER,
      caraPesanId: DataTypes.INTEGER,
      galeriId: DataTypes.INTEGER,
      faqId: DataTypes.INTEGER,
      pembayaranId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "InfoBisnis",
    }
  );
  return InfoBisnis;
};
