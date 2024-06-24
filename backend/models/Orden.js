import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Orden = sequelize.define(
    "Orden", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING
        },
        apellido: {
            type: DataTypes.STRING
        },
        fechaOrden: {
            type: DataTypes.DATE
        },
        cuentaTotal: {
            type: DataTypes.INTEGER
        },
        correo: {
            type: DataTypes.STRING
        },
        estado: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
