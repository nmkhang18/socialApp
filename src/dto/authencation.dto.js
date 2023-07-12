const db = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')
const bcrypt = require('bcryptjs')


class dto {
    async getLoginInfo(email) {
        return await db.USER.findOne({
            where: {
                [Op.or]: [
                    { USERNAME: email },
                    { EMAIL: email }
                ]
            }
        })
    }

    async getDuplicateInfo(user) {
        return await db.USER.findOne({
            where: {
                [Op.or]: [
                    { USERNAME: user.username ? user.username : "" },
                    { EMAIL: user.email }
                ]
            }
        })
    }
    async saveUser(user) {
        try {
            await db.USER.create({
                USERNAME: user.username,
                FULLNAME: user.fullname,
                EMAIL: user.email,
                PASSWORD: user.hashPassword,
                GENDER: user.gender,
                ADDRESS: user.address,
                MOBILE: user.mobile
            })
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async saveOTP(email, otp) {
        try {
            let result = await db.OTP.findByPk(email)
            if (result) {
                result.VALUE = otp
                result.THOIHAN = otpTimeOut(2)
                await result.save()
                return 1
            }
            let saveOTP = await db.OTP.create({
                EMAIL: email,
                VALUE: otp,
                THOIHAN: otpTimeOut(2),
            })
            return saveOTP ? 1 : 0
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async savePassword(email, password) {
        try {
            const result = await db.USER.findOne({
                where: {
                    EMAIL: email
                }
            })
            result.PASSWORD = password
            await result.save()
            return 1
        } catch (error) {
            console.log(error)
            return 0
        }
    }
}

module.exports = new dto