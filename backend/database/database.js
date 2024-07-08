import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres@deploybeta0postgres", "Database!1", {
    host: "deploybeta0postgres.postgres.database.azure.com",
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
