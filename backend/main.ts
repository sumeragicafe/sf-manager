import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import router from '@routes/index';

import { initUserModel } from '@infra/sequelize/models/User.model';
//import { initPetModel } from './infra/db/models/Pet.model';
//import { initUsuarioModel } from './infra/db/models/Usuario.model';
// import routes from './routes'; // Pode ser criado posteriormente


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_HOST || process.env.MYSQL_PORT) {
  throw new Error('Variáveis de ambiente do banco não configuradas');
}

const database = process.env.MYSQL_DATABASE!;
const user = process.env.MYSQL_USER!;
const password = process.env.MYSQL_PASSWORD!;
const host = process.env.MYSQL_HOST!;
const port = Number(process.env.MYSQL_PORT) || 3306;

const sequelize = new Sequelize(
    database,
    user,
    password,
    {
        host: host,
        port: port,
        dialect: "mysql",
        logging: false,
    }
);

// Inicializa modelos
initUserModel(sequelize);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com banco
sequelize
  .authenticate()
  .then(() => console.log('Conectado ao banco de dados.'))
  .catch((error) => console.error('Erro ao conectar ao banco:', error));

app.use('/api', router);

// Início do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
