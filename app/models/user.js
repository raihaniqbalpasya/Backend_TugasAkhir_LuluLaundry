"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Pemesanan, { foreignKey: "userId" });
      this.hasMany(models.Review, { foreignKey: "userId" });
      this.hasMany(models.Alamat, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      noTelp: DataTypes.STRING,
      otp: DataTypes.STRING,
      tglLahir: DataTypes.DATE,
      alamatUser: {
        type: DataTypes.STRING,
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.STRING,
        values: ["Full Access", "Limited Access"],
      },
      profilePic: DataTypes.STRING,
      totalOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
