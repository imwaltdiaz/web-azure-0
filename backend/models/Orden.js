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
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
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
            type: DataTypes.STRING //Solo opciones palabras "Tarjeta" o "QR"
        },
        nroTarjeta: {
            type: DataTypes.INTEGER
        },
        envio: {
            type: DataTypes.STRING //Solo opciones palabras "Economico" o "Prioritario"
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
