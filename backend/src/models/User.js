import { DataTypes } from "sequelize";
import sequelize from "../config/database/index.js";

import UserAccess from "./UserAccess.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true,
        },

        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        telephone: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },       

        email: {
            type: DataTypes.STRING(320),
            allowNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING(16),
            allowNull: false
        }
    },
    {
        tableName: "user_table",
        timestamps: true, // Adiciona os campos createdAt e updatedAt, ainda não sei exatamente a utilidade
    }
);

User.hasOne(UserAccess, {
    foreignKey: 'user_id'
});
UserAccess.belongsTo(User);

User.sync({alter : true});

export default User;
