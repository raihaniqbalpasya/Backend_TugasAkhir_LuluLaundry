"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pemasukan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  Pemasukan.init(
    {
      adminId: DataTypes.INTEGER,
      nominal: DataTypes.INTEGER,
      tipe: DataTypes.STRING,
      catatan: DataTypes.TEXT,
      tanggal: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Pemasukan",
    }
  );
  return Pemasukan;
};
