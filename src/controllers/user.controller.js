const db = require('../models/index')
const Sequelize = require('sequelize')
const validator = require('../validations/user.validator')
const dto = require('../dto/user.dto')
const notiDTO = require('../dto/noti.dto')
const { uploadDrive } = require('../helpers/helpers')



class controller {
    async updateAvatar(req, res) {
        if (!req.files.file) return res.json({
            status: 0,
            message: 'missing data'
        })

        const img = await uploadDrive(req.files.file.data)
        if (!img) return res.json({
            status: 0,
            message: 'Upload img failed'
        })
        try {
            if (await dto.saveAvatar(req.user._id, img)) return res.json({
                status: 1,
                message: ''
            })
            return res.json({
                status: 0,
                message: ''
            })
        } catch (error) {
            console.log(error)
            return res.json({
                status: 0,
                message: error.message
            })
        }


    }
    async defaultAvatar(req, res) {
        try {
            const img = 'https://drive.google.com/uc?export=view&id=1ykzTh94lBOt09jupQcdLeG1NflVo5jiq'
            if (await dto.saveAvatar(req.user._id, img)) return res.json({
                status: 1,
                message: ''
            })
            return res.json({
                status: 0,
                message: ''
            })
        } catch (error) {
            console.log(error)
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
    async updateInfomation(req, res) {
        const { username, fullname, address, mobile, gender } = req.body
        const { error } = validator.updateUser(req.body)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message
        })

        req.body.id = req.user._id

        try {
            if (await dto.saveChange(req.body)) return res.json({
                status: 1,
                message: ''
            })
            return res.json({
                status: 0,
                message: ''
            })


        } catch (error) {
            console.log(error)
            return res.json({
                status: 0,
                message: error.message
            })
        }

    }
    async updatePassword(req, res) {
        const { error } = validator.updateUser(req.body)
        if (error) return res.json({
            status: 0,
            message: error.details[0].message
        })
        try {
            const salt = await bcrypt.genSaltSync(10)

        } catch (error) {

        }
    }
    async follow(req, res) {
        try {
            console.log(req.user._id);
            if (await dto.follow(req.user._id, req.params.id)) {
                await notiDTO.createNoti({ USER_ID: req.user._id, R_USER_ID: req.params.id, TYPE: "follow" })
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
    async unfollow(req, res) {
        try {
            if (await dto.unfollow(req.user._id, req.params.id)) return res.json({
                status: 1,
                message: ''
            })
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
    async getUserInfo(req, res) {
        return res.json({
            result: await dto.getUserInfo(req.params.id)
        })
    }
    async search(req, res) {
        return res.json({
            result: await dto.search(req.query.username)
        })
    }
    async notification(req, res) {
        return res.json({
            result: await notiDTO.getNoti(req.user._id)
        })
    }
}

module.exports = new controller