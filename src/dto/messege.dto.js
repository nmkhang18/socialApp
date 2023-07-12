const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')
const { createId } = require('../helpers/helpers')

class dto {
    async getMessege(id, offset, limit) {
        try {
            return await db.MESSEGES.findAll({
                where: {
                    CONVERSATION_ID: id
                },
                order: [
                    ['createdAt', 'DESC'],
                ],
                offset: offset,
                limit: limit
            })
        } catch (error) {
            return 0
        }
    }
    async createMessege(user_id, con_id, type, content) {
        try {
            await db.MESSEGES.create({
                ID: createId(),
                SEND_USER_ID: user_id,
                CONVERSATION_ID: con_id,
                TYPE: type,
                CONTENT: content
            })
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
}

module.exports = new dto