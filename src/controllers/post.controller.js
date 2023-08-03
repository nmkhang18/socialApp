const db = require('../models/index')
const Sequelize = require('sequelize')
const { uploadDrive } = require('../helpers/helpers')
const dto = require('../dto/post.dto')
const { createId } = require('../helpers/helpers')


class controller {
    async createPost(req, res) {

        if (!req.files.file) return res.json({
            status: 0,
            message: 'missing data'
        })
        const id = createId()
        const post = {
            ID: id,
            CREATED_BY_USER_ID: req.user._id,
            CAPTION: req.body.caption ? req.body.caption : '',
        }
        let images = []

        try {
            for (let i = 0; i < req.files.file.length; i++) {
                images.push({ IMAGE: await uploadDrive(req.files.file[i].data), POST_ID: id })
            }


            if (await dto.savePost(post, images)) return res.json({
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
    async updatePost(req, res) {

    }
    async deletePost(req, res) {

    }
    async likePost(req, res) {
        try {
            console.log(req.user);

            if (await dto.likePost(req.user._id, req.params.id)) return res.json({
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
    async unlikePost(req, res) {
        try {
            if (await dto.unlikePost(req.user._id, req.params.id)) return res.json({
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
    async commentPost(req, res) {

    }
}

module.exports = new controller