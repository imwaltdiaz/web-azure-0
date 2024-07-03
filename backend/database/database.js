import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres", "postgres", {
    host: "",
    dialect: "postgres"
});