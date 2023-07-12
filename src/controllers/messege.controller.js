const db = require('../models/index')
const Sequelize = require('sequelize')
const dto = require('../dto/messege.dto')


class controller {
    async createConversation(req, res) {

    }
    async getMessege(req, res) {
        const { page, offset } = req.query
        try {
            return res.json({
                result: await dto.getMessege(req.params.conversationId, parseInt(page) * 3 + parseInt(offset), 3)
            })
        } catch (error) {
            return res.json({
                success: false
            })
        }
    }
    async createMessege(req, res) {
        try {
            if (req.body.type)

                if (await dto.createMessege(req.user._id, req.params.conversationId, req.body.type, req.body.content)) return res.json({
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
    async deleteMessege(req, res) {

    }
}

module.exports = new controller