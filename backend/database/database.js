import { Sequelize } from "sequelize";

// Configuración de Sequelize
export const sequelize = new Sequelize("postgres", "postgres", "postgres", {
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
    logging: false,
});

// Función para autenticar la conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos.');
    } catch (error) {
        console.error('No se puede conectar a la base de datos:', error);
    }
})();
