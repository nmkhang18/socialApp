const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')

class dto {
    async createNoti(noti) {
        try {
            await db.NOTIFICATION.create(noti)
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async getNoti(id) {
        try {
            const result = await db.NOTIFICATION.findAll({
                include: {
                    model: db.USER,
                    attributes: ["USERNAME", "AVATAR"],
                    require: true
                },
                where: {
                    R_USER_ID: id
                }
            })

            return result
        } catch (error) {
            console.log(error);
            return 0
        }
    }
}

module.exports = new dto