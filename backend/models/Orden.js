import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Orden_Producto } from "./Orden_Producto.js";
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
Orden.belongsToMany(Producto, { through: Orden_Producto, foreignKey: 'ordenId' });
Producto.belongsToMany(Orden, { through: Orden_Producto, foreignKey: 'productoId' });
Orden.hasMany(Orden_Producto, { foreignKey: 'ordenId' });
Orden_Producto.belongsTo(Orden, { foreignKey: 'ordenId' });
Producto.hasMany(Orden_Producto, { foreignKey: 'productoId' });
Orden_Producto.belongsTo(Producto, { foreignKey: 'productoId' });
