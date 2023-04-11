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
      this.hasMany(models.Acara, { foreignKey: "adminId" });
      this.hasMany(models.Keuangan, { foreignKey: "adminId" });
      this.hasMany(models.Pemesanan, { foreignKey: "adminId" });
    }
  }
  Admin.init(
    {
      role: {
        type: DataTypes.STRING,
        values: ["master", "basic"],
      },
      nama: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      otp: DataTypes.INTEGER,
      profilePic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
