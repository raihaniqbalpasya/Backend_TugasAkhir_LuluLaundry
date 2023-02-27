'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JenisLayanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pemesanan, { foreignKey: "layananId" });
    }
  }
  JenisLayanan.init({
    layanan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'JenisLayanan',
  });
  return JenisLayanan;
};