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
    async createConv(id, users) {
        console.log(id);
        console.log(users);
        try {
            await sequelize.transaction(async t => {
                await db.CONVERSATION.create({ ID: id, TITLE: '' }, { transaction: t })
                await db.USER_CONVERSATION.bulkCreate(users, { transaction: t })
            })
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async getConv(user_id) {
        try {
            const result = await db.USER_CONVERSATION.findAll({
                where: {
                    USER_ID: user_id
                },
                attributes: [],
                include: {
                    model: db.CONVERSATION,
                    attributes: ["ID", "TITLE"],
                    include: {
                        model: db.USER_CONVERSATION,
                        attributes: ["USER_ID"],
                        where: {
                            USER_ID: {
                                [Op.not]: user_id
                            }
                        },
                        include: {
                            model: db.USER,
                            attributes: ["USERNAME", "FULLNAME", "AVATAR"],
                            required: true
                        },
                        required: true
                    },
                    required: true
                }

            })
            return result
        } catch (error) {
            console.log(error)
            return 0
        }
    }
}

module.exports = new dto