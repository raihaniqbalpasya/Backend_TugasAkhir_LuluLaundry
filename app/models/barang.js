"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Pemesanan, {
        foreignKey: "pemesananId",
        onDelete: "CASCADE",
      });
    }
  }
  Barang.init(
    {
      pemesananId: DataTypes.INTEGER,
      namaBarang: DataTypes.STRING,
      jenisLaundry: DataTypes.STRING,
      kuantitas: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      catatan: DataTypes.STRING,
      gambar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Barang",
    }
  );
  return Barang;
};
