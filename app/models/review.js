"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" });
      this.belongsTo(models.Pemesanan, { foreignKey: "pemesananId" });
    }
  }
  Review.init(
    {
      userId: DataTypes.INTEGER,
      pemesananId: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      review: DataTypes.TEXT,
      gambar: DataTypes.STRING,
      tanggal: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
