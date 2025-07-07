import { DataTypes } from "sequelize";
import sequelize from "../config/database/index.js";

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        end_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        place: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },  
        
        virtual: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }, 
    },
    {
        tableName: "event_table",
        timestamps: true, // Adiciona os campos createdAt e updatedAt, ainda não sei exatamente a utilidade
    }
);

Event.sync({alter : true});

export default Event;