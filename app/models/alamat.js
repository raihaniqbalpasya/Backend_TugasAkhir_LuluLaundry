"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Alamat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Alamat.init(
    {
      userId: DataTypes.INTEGER,
      kategori: DataTypes.STRING,
      detail: DataTypes.STRING,
      kecamatan: DataTypes.STRING,
      kelurahan: DataTypes.STRING,
      rt: DataTypes.STRING,
      rw: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      gambar: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        values: ["Priority", "Standard"],
      },
    },
    {
      sequelize,
      modelName: "Alamat",
    }
  );
  return Alamat;
};
