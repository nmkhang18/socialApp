'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NOTIFICATION extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    NOTIFICATION.init({
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        USER_ID: DataTypes.INTEGER,
        POST_ID: DataTypes.INTEGER,
        R_USER_ID: DataTypes.INTEGER,
        TYPE: DataTypes.STRING(500),




    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'NOTIFICATION',
    });

    return NOTIFICATION;
};