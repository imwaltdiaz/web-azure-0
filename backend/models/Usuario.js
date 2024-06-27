import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Orden } from "./Orden.js";
export const Usuario = sequelize.define(
    "Usuario", {
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
        correo: {
            type: DataTypes.STRING
        },
        contrasena: {
            type: DataTypes.STRING
        },
        fechaRegistro: {
            type: DataTypes.STRING
        },
        estado: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true
});
Usuario.hasMany(Orden, {foreignKey: 'usuarioId', sourcekey: 'id'});
Orden.belongsTo(Usuario, {foreignKey: 'usuarioId', targetkey: 'id'});