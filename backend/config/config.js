import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default {
  development: {
    username: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASSWORD || 'user',
    database: process.env.MYSQL_DATABASE || 'sf-manager',
    host: process.env.MYSQL_HOST || 'host.docker.internal',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
  },
  test: {
    username: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASSWORD || 'user',
    database: process.env.MYSQL_DATABASE ? `${process.env.MYSQL_DATABASE}_test` : 'sf-manager_test',
    host: process.env.MYSQL_HOST || 'host.docker.internal',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    dialect: 'mysql',
  },
};
