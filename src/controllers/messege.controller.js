const db = require('../models/index')
const Sequelize = require('sequelize')
const dto = require('../dto/messege.dto')
const { createId } = require('../helpers/helpers')


class controller {
    async getConv(req, res) {
        try {
            return res.json({
                result: await dto.getConv(req.user._id)
            })
        } catch (error) {
            return res.json({
                success: false
            })
        }
    }
    async createConversation(req, res) {
        try {
            const id = createId()
            if (await dto.createConv(id, [{ CONVERSATION_ID: id, USER_ID: req.user._id }, { CONVERSATION_ID: id, USER_ID: req.params.id }])) return res.redirect(`/api/messege/${id}?page=0&offset=0`)
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