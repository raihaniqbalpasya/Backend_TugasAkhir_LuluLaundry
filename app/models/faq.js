"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FAQ.init(
    {
      pertanyaan: DataTypes.STRING,
      jawaban: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "FAQ",
    }
  );
  return FAQ;
};
