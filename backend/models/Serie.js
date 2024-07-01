import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";

export const Serie = sequelize.define(
  "Serie", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaRegistro: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    NroProductos: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true
  }
);

Serie.hasMany(Producto, {foreignKey: 'serieId'});
Producto.belongsTo(Serie, {foreignKey: 'serieId'});
