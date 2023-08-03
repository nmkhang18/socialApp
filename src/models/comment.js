'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class COMMENT extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    COMMENT.init({
        ID: {
            type: DataTypes.STRING(500),
            primaryKey: true,
        },
        CREATED_BY: DataTypes.STRING(500),
        POST_ID: DataTypes.STRING(500),
        CONTENT: DataTypes.STRING(500),
        COMMENT_REPLIED_TO: DataTypes.INTEGER,
    }, {
        sequelize,
        freezeTableName: true,
        modelName: 'COMMENT',
    });

    return COMMENT;
};