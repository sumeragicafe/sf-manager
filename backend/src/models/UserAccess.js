import { DataTypes } from "sequelize";
import sequelize from "../config/database/index.js";

const UserAccess = sequelize.define(
    "UserPermission",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
            type: DataTypes.INTEGER,
        },

        root: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        administrator: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

        content_editor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    
        administrative_editor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "user_access_table",
        timestamps: true, // Adiciona os campos createdAt e updatedAt, ainda não sei exatamente a utilidade
    }
);

UserAccess.sync({alter : true});

export default UserAccess;