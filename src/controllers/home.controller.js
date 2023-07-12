const db = require('../models/index')
const Sequelize = require('sequelize')
const dto = require('../dto/post.dto')

class controller {
    async getNewfeed(req, res) {
        return res.json({
            result: await dto.getPost(req.user._id, 1, 1)
        })
    }
    async getRelevantUser(req, res) {

    }
}

module.exports = new controller