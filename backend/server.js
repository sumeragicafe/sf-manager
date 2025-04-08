const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./src/config/database');

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
const routes = require(path.join(__dirname, 'src', 'routes', 'index.js'));
app.use('/api', routes);

// Starting Server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
