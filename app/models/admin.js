"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.EventPromo, { foreignKey: "adminId" });
      this.hasMany(models.Pemasukan, { foreignKey: "adminId" });
      this.hasMany(models.Pengeluaran, { foreignKey: "adminId" });
      this.hasMany(models.Pemesanan, { foreignKey: "adminId" });
    }
  }
  Admin.init(
    {
      role: {
        type: DataTypes.STRING,
        values: ["superadmin", "admin"],
      },
      nama: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      alamat: DataTypes.STRING,
      profilePic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
