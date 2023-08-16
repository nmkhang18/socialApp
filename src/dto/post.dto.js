const db = require('../models/index')
const Sequelize = require('sequelize')
const { sequelize } = require('../models/index')
const Op = Sequelize.Op
const { otpTimeOut, sendEmail, createId } = require('../helpers/helpers')


class dto {
    async getPost(userId, offset, limit) {
        try {
            const getFollowed = await db.FOLLOWER.findAll({
                where: {
                    FOLLOWING_USER_ID: userId
                },
                attributes: ["FOLLOWED_USER_ID"]
            })
            let followed = []
            getFollowed.forEach(element => {
                followed.push(element.dataValues.FOLLOWED_USER_ID)
            })
            followed.push(userId)
            const result = await db.POST.findAll({
                include: [
                    {
                        model: db.POST_IMAGE,
                        required: true,
                        attributes: ["IMAGE"]
                    },
                    {
                        model: db.USER,
                        required: true,
                        attributes: [
                            "ID",
                            "USERNAME",
                            "FULLNAME",
                            "AVATAR",
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWING_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWING_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWING_USER_ID"), 0)`),
                                'FOLLOWING',
                            ],
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                                'FOLLOWERS',
                            ],
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("POST1"."CREATED_BY_USER_ID") FROM "POST" AS "POST1" WHERE "POST1"."CREATED_BY_USER_ID" = "USER"."ID" GROUP BY "POST1"."CREATED_BY_USER_ID"), 0)`),
                                'POSTS',
                            ]
                        ]
                    }
                ],
                where: {
                    CREATED_BY_USER_ID: followed
                },
                attributes: [
                    "ID",
                    "CAPTION",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'LIKES',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" AND "LIKE"."USER_ID" = '${userId}' GROUP BY "POST"."ID"), 0)`),
                        'ISLIKED',
                    ],
                    "createdAt",
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            return result
        } catch (error) {
            console.log(error.message);
        }
    }
    async savePost(post, images) {
        try {
            await sequelize.transaction(async t => {
                await db.POST.create(post, { transaction: t })

                await db.POST_IMAGE.bulkCreate(images, { transaction: t })
            })
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }

    async likePost(user_id, post_id) {
        try {
            await db.LIKE.create({
                USER_ID: user_id,
                POST_ID: post_id
            })
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async unlikePost(user_id, post_id) {
        try {
            const result = await db.LIKE.findOne({
                where: {
                    USER_ID: user_id,
                    POST_ID: post_id
                }
            })
            await result.destroy()
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async comment(cmt) {
        try {
            await db.COMMENT.create(cmt)
            return 1
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async getComment(post_id) {
        try {
            const result = await db.COMMENT.findAll({
                include: [
                    {
                        model: db.COMMENT,
                        include: {
                            model: db.USER,
                            attributes: ["ID", "FULLNAME", "USERNAME", "AVATAR", "EMAIL"],
                            required: true,
                        },
                        attributes: ["ID", "POST_ID", "CONTENT", "COMMENT_REPLIED_TO", "createdAt"]
                        // required: true,
                    },
                    {
                        model: db.USER,
                        attributes: ["ID", "FULLNAME", "USERNAME", "AVATAR", "EMAIL"],
                        required: true,
                    },
                ],
                where: {
                    POST_ID: post_id,
                    COMMENT_REPLIED_TO: {
                        [Op.eq]: null
                    }
                },
                attributes: ["ID", "POST_ID", "CONTENT", "createdAt"]
            })
            return result
        } catch (error) {
            console.log(error.message);
            return 0
        }
    }
    async getPostByUser(userId, offset, limit) {
        try {
            const result = await db.POST.findAll({
                include: [
                    {
                        model: db.POST_IMAGE,
                        required: true,
                        attributes: ["IMAGE"]
                    },
                    {
                        model: db.USER,
                        required: true,
                        attributes: [
                            "ID",
                            "USERNAME",
                            "FULLNAME",
                            "AVATAR",
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWING_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWING_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWING_USER_ID"), 0)`),
                                'FOLLOWING',
                            ],
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("FOLLOWER"."FOLLOWED_USER_ID") FROM "FOLLOWER" WHERE "FOLLOWER"."FOLLOWED_USER_ID" = "USER"."ID" GROUP BY "FOLLOWER"."FOLLOWED_USER_ID"), 0)`),
                                'FOLLOWERS',
                            ],
                            [
                                sequelize.literal(`COALESCE((SELECT COUNT("POST1"."CREATED_BY_USER_ID") FROM "POST" AS "POST1" WHERE "POST1"."CREATED_BY_USER_ID" = "USER"."ID" GROUP BY "POST1"."CREATED_BY_USER_ID"), 0)`),
                                'POSTS',
                            ]
                        ]
                    }
                ],
                where: {
                    CREATED_BY_USER_ID: userId
                },
                attributes: [
                    "ID",
                    "CAPTION",
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" GROUP BY "POST"."ID"), 0)`),
                        'LIKES',
                    ],
                    [
                        sequelize.literal(`COALESCE((SELECT COUNT("LIKE"."POST_ID") FROM "LIKE" WHERE "LIKE"."POST_ID" = "POST"."ID" AND "LIKE"."USER_ID" = '${userId}' GROUP BY "POST"."ID"), 0)`),
                        'ISLIKED',
                    ],
                    "createdAt",
                ],
                order: [
                    ['createdAt', 'DESC'],
                ],
            })
            return result
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new dto