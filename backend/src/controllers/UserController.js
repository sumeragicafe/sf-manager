import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const { rows: users, count } = await User.findAndCountAll({
            limit,
            offset,
            order: [["id", "ASC"]], 
        });

        res.json({
            total: count,
            page,
            pages: Math.ceil(count / limit),
            perPage: limit,
            data: users,
        });
    } catch (_error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (_error) {
        res.status(400).json({ error: "Erro ao criar usuário." });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado." });
        }
    } catch (_error) {
        res.status(500).json({ error: "Erro ao buscar usuário." });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ name, email });
            res.json(user);
        } else {
            res.status(404).json({ error: "Usuário não encontrado." });
        }
    } catch (_error) {
        res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: "Usuário deletado com sucesso." });
        } else {
            res.status(404).json({ error: "Usuário não encontrado." });
        }
    } catch (_error) {
        res.status(500).json({ error: "Erro ao deletar usuário." });
    }
};
