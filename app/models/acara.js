"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Acara extends Model {
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
  Acara.init(
    {
      adminId: DataTypes.INTEGER,
      nama: DataTypes.STRING,
      gambar: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      kriteria: DataTypes.ARRAY(DataTypes.STRING),
      reward: DataTypes.ARRAY(DataTypes.STRING),
      status: DataTypes.STRING,
      jumlah: DataTypes.INTEGER,
      tglMulai: DataTypes.DATE,
      tglSelesai: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Acara",
    }
  );
  return Acara;
};
