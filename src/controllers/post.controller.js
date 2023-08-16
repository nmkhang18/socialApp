const db = require('../models/index')
const Sequelize = require('sequelize')
const { uploadDrive } = require('../helpers/helpers')
const dto = require('../dto/post.dto')
const { createId } = require('../helpers/helpers')
const notiDTO = require('../dto/noti.dto')


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
            if (typeof (req.files.file.length) == "number") {
                for (let i = 0; i < req.files.file.length; i++) {
                    images.push({ IMAGE: await uploadDrive(req.files.file[i].data), POST_ID: id })
                }
            } else {
                images.push({ IMAGE: await uploadDrive(req.files.file.data), POST_ID: id })
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
            console.log(error.message);
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

            if (await dto.likePost(req.user._id, req.params.id)) {
                await notiDTO.createNoti({ USER_ID: req.user._id, R_USER_ID: req.params.id, POST_ID: req.params.id, TYPE: "like" })
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
            console.log(error.message);
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
            console.log(error.message);
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
    async commentPost(req, res) {
        const cmt = {
            ID: createId(),
            CREATED_BY: req.user._id,
            POST_ID: req.params.post_id,
            CONTENT: req.body.content,
        }
        if (req.params.comment_id != "none") {
            cmt.COMMENT_REPLIED_TO = req.params.comment_id
            await notiDTO.createNoti({ USER_ID: req.user._id, R_USER_ID: req.params.comment_id, POST_ID: req.params.id, TYPE: "reply_comment" })
        }
        try {
            if (await dto.comment(cmt)) {
                await notiDTO.createNoti({ USER_ID: req.user._id, R_USER_ID: req.params.id, POST_ID: req.params.id, TYPE: "comment" })
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
            console.log(error.message);
            return res.json({
                status: 0,
                message: error.message
            })
        }
    }
    async getComment(req, res) {
        return res.json({
            result: await dto.getComment(req.params.post_id)
        })
    }
    async getPostByUser(req, res) {
        return res.json({
            result: await dto.getPost(req.params.user_id)
        })
    }
}

module.exports = new controller