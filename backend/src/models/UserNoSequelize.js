const pool = require('../config/database');

// No Sequelize Example
const User = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0]; // Retorna apenas um usuário
    },

    async create(name, email) {
        const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
        return { id: result.insertId, name, email };
    },

    async update(id, name, email) {
        await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return { id, name, email };
    },

    async delete(id) {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return { message: 'Usuário deletado com sucesso' };
    }
};

module.exports = User;
