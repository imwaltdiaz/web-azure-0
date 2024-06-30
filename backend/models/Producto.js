import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Orden_Producto } from "./Orden_Producto.js";
export const Producto = sequelize.define(
    "Producto", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        detalle: {
            type: DataTypes.STRING
        },	
        precio: {
            type: DataTypes.INTEGER
        },
        fechaRegistro: {
            type: DataTypes.DATE
        },
        stock: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });