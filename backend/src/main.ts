import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { Sequelize } from 'sequelize';
import router from '@interface/routes/index';
import { initUserModel } from '@infra/sequelize/models/User.model';
import { initPermissionModel } from '@infra/sequelize/models/Permission.model';
import { initRoleModel } from '@infra/sequelize/models/Role.model';
import { associateRolePermission } from '@infra/sequelize/models/RolePermission.model';
import { initAnimalModel } from '@infra/sequelize/models/Animal.model';
import { initAdoptionRequestModel, defineAdoptionRequestAssociations } from '@infra/sequelize/models/AdoptionRequest.model';

//import { initPetModel } from './infra/db/models/Pet.model';
//import { initUsuarioModel } from './infra/db/models/Usuario.model';
// import routes from './routes'; // Pode ser criado posteriormente


dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);

if (!process.env.MYSQL_DATABASE || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_HOST || !process.env.MYSQL_PORT) {
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
initRoleModel(sequelize);
initPermissionModel(sequelize);
initUserModel(sequelize);
initAnimalModel(sequelize);
initAdoptionRequestModel(sequelize);

// Associações
associateRolePermission(sequelize);
defineAdoptionRequestAssociations();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com banco
sequelize
  .authenticate()
  .then(() => console.log('Conectado ao banco de dados.'))
  .catch((error) => console.error('Erro ao conectar ao banco:', error));

// Iniciar o container na primeira vez com o trecho abaixo, depois comente para não sobreescrever o DDL
// Executar seeder (dentro do exec backend): npx sequelize-cli db:seed:all

// sequelize
//   .sync({ force: true }) // força recriação das tabelas
//   .then(() => {
//     console.log('Tabelas criadas/sincronizadas');
//   });

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure: true se usar HTTPS
}));

app.use('/api', router);

// Início do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
