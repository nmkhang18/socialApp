const express = require('express')
const controller = require('../controllers/post.controller')
const authencation = require('../middlewares/authencation.middleware')

const router = express.Router()


//GET



//POST
router.post('/', authencation.login, controller.createPost)
router.post('/comment/:id', controller.commentPost)
router.delete('/like/:id', authencation.login, controller.unlikePost)
router.post('/like/:id', authencation.login, controller.likePost)



//PUT
router.put('/:id', controller.updatePost)


//DELETE
router.delete('/:id', controller.deletePost)


module.exports = router