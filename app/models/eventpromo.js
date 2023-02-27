"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventPromo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pemesanan, { foreignKey: "promoId" });

      this.belongsTo(models.Admin, { foreignKey: "adminId" });
    }
  }
  EventPromo.init(
    {
      adminId: DataTypes.INTEGER,
      nama: DataTypes.STRING,
      jenisPromo: DataTypes.INTEGER,
      gambar: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      kriteria: DataTypes.STRING,
      status: DataTypes.STRING,
      jumlah: DataTypes.INTEGER,
      tglMulai: DataTypes.DATE,
      tglSelesai: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "EventPromo",
    }
  );
  return EventPromo;
};
