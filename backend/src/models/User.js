import { DataTypes } from "sequelize";
import sequelize from "../config/database/index.js";

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
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "users",
        timestamps: false, // Remove os campos createdAt e updatedAt
    }
);

export default User;
