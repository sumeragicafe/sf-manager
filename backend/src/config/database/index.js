const { Sequelize } = require("sequelize");
require("dotenv").config(); // Para carregar variáveis de ambiente

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        logging: false,
    }
);

module.exports = sequelize;
