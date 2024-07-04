import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("tienditadelabuelo", "usr_tienditadelabuelo", "48&%$785%&HrPo45&$Kl", {
    host: "tienditadelabuelo.postgres.database.azure.com",
    dialect: "postgres"
});
