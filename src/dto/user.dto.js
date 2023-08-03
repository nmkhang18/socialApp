const db = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail } = require('../helpers/helpers')

class dto {
    async saveChange(user) {
        try {
            const result = await db.USER.findByPk(user.id)
            if (!result) return 0
            console.log(result);
            result.USERNAME = user.username
            result.FULLNAME = user.fullname
            result.ADDRESS = user.address
            result.MOBILE = user.mobile
            result.GENDER = user.gender
            await result.save()
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async saveAvatar(user_id, img) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return 0
            result.AVATAR = img
            await result.save()
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async newPassword(old_p, new_p) {
        try {
            const result = await db.USER.findByPk(user_id)
            if (!result) return 0
            if (result.PASSWORD == old_p) {
                result.PASSWORD = new_p
                await result.save()
                return 1
            }
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async follow(user_id, followed_user_id) {
        try {
            await db.FOLLOWER.create({
                FOLLOWING_USER_ID: user_id,
                FOLLOWED_USER_ID: followed_user_id
            })
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
    async unfollow(user_id, followed_user_id) {
        try {
            const result = await db.FOLLOWER.findOne({
                where: {
                    FOLLOWING_USER_ID: user_id,
                    FOLLOWED_USER_ID: followed_user_id
                }
            })
            await result.destroy()
            return 1
        } catch (error) {
            console.log(error);
            return 0
        }
    }
}

module.exports = new dto