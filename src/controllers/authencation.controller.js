const db = require('../models/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const dto = require('../dto/authencation.dto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('../validations/authencation.validator')
const { createId, sendEmail } = require('../helpers/helpers')
const OtpGenerator = require('otp-generator')


class controller {
    async login(req, res) {
        const { email, password } = req.body
        const { error } = validator.loginValitdation(req.body)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message
        })
        try {
            let result = await dto.getLoginInfo(email)
            console.log(result);


            if (!result) return res.json({
                status: 0,
                message: 'Email does not exist'
            })
            if (result.TRANGTHAI == false) return res.json({
                status: 0,

                message: 'Account banned'
            })
            if (!bcrypt.compareSync(password, result.PASSWORD)) return res.json({
                status: 0,

                message: 'Incorrect password'
            })
            const token = jwt.sign({ _id: result.ID, exp: Math.floor(Date.now() / 1000 + (60 * parseInt(process.env.TOKEN_TIME))) }, process.env.TOKEN_SECRET)
            return res.json({
                status: 1,
                accessToken: token

            })

        } catch (error) {
            return res.json({
                status: 0,

                message: ''
            })
        }
    }

    async regist(req, res) {
        const { username, fullname, email, password, re_password, gender, address, mobile, otp } = req.body
        const user = req.body
        const { error } = validator.registValitdation(user)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message
        })

        try {
            const checkOTP = await db.OTP.findByPk(email)
            if (!checkOTP) return res.json({
                status: 0,
                message: 'Invalid OTP'
            })
            if (!bcrypt.compareSync(otp, checkOTP.VALUE)) return res.json({
                status: 0,
                message: 'Incorrect otp'
            })
            const expireTime = new Date(checkOTP.THOIHAN)
            const now = new Date()
            console.log(expireTime.getTime());
            if (now.getTime() > expireTime.getTime()) return res.json({
                status: 0,
                message: 'OTP expired'
            })
        } catch (error) {
            console.log(error.message);
            return res.json({
                status: 0,
                message: 'Cannot valiadte OTP, Please try again.'
            })
        }

        try {
            const checkDuplicate = await dto.getDuplicateInfo(user)
            if (checkDuplicate) {
                return res.json({
                    status: 0,
                    message: 'Username exists'
                })
            }

            const salt = await bcrypt.genSaltSync(10)
            user.hashPassword = await bcrypt.hash(user.password, salt)
            if (await dto.saveUser(user))
                return res.json({
                    status: 1,
                    message: 'Create user successfull'
                })

        } catch (error) {
            console.log(error.message);
            return res.json({
                status: 0,
                message: 'Cannot create User, Please try again.'
            })
        }
    }
    async sendOTP(req, res) {
        const { email } = req.body
        const type = req.params.type
        const { error } = validator.sendOTPValidation(req.body)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message
        })
        try {
            const checkMail = await dto.getDuplicateInfo(req.body)
            console.log(checkMail);

            if (checkMail && type == "regist") return res.json({
                status: 0,
                message: 'Email existed'
            })
            else if (!checkMail && type == "forget") return res.json({
                status: 0,
                message: 'Email not existed'
            })
            const otp = await OtpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })
            const salt = await bcrypt.genSaltSync(10)
            const hashOtp = await bcrypt.hash(otp, salt)

            if (await dto.saveOTP(email, hashOtp)) {
                return res.json({
                    status: sendEmail(email, otp) ? 1 : 0,
                    message: ''
                })
            }
            return res.json({
                status: 0,
                message: ''

            })
        } catch (error) {
            console.log(error);
            return res.json({
                status: 0,
                message: ''

            })
        }
    }
    async changePassword(req, res) {
        const { email, password, re_password, otp } = req.body
        const { error } = validator.forgotPasswordValitdation(req.body)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message

        })
        try {
            const checkOTP = await db.OTP.findByPk(email)
            if (!checkOTP) return res.json({
                status: 0,
                message: 'Invalid OTP'
            })
            if (!bcrypt.compareSync(otp, checkOTP.VALUE)) return res.json({
                status: 0,
                message: 'Incorrect otp'
            })
            const expireTime = new Date(checkOTP.THOIHAN)
            const now = new Date()
            console.log(expireTime.getTime());
            if (now.getTime() > expireTime.getTime()) return res.json({
                status: 0,
                message: 'OTP expired'
            })

            const salt = await bcrypt.genSaltSync(10)

            if (await dto.savePassword(email, await bcrypt.hash(password, salt))) {
                return res.json({
                    status: 1,
                    message: ''
                })
            }
            return res.json({
                status: 0,
                message: ''
            })


        } catch (error) {
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
}

module.exports = new controller