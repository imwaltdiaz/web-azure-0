import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
export const Producto = sequelize.define(
    "Producto", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        detalle: {
            type: DataTypes.STRING,
            allowNull: false
        },	
        precio: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fechaRegistro: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        freezeTableName: true
    });