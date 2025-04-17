import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mysql2 from 'mysql2';
import sequelize from './src/config/database/index.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

sequelize
.authenticate()
.then(() => console.log("Conectado ao banco de dados."))
.catch((error) => console.error("Erro ao conectar ao banco:", error));


// Routes
app.use('/api', routes);

// Starting Server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
