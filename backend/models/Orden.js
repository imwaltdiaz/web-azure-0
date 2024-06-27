import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Orden = sequelize.define(
    "Orden", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fechaOrden: {
            type: DataTypes.STRING
        },
        cuentaTotal: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
