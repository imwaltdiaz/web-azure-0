import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Producto } from "./Producto.js";
export const Orden = sequelize.define(
    "Orden", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fechaOrden: {
            type: DataTypes.DATE
        },
        cuentaTotal: {
            type: DataTypes.INTEGER
        },
        estado: {
            type: DataTypes.STRING
        },
        direccion: {
            type: DataTypes.STRING
        },
        metPago: {
            type: DataTypes.STRING
        },
        nroTarjeta: {
            type: DataTypes.STRING
        },
        envio: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
    });
Orden.hasMany(Producto, { foreignKey: 'ordenId' });
Producto.belongsTo(Orden, { foreignKey: 'ordenId' });
