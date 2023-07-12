const express = require('express')
const controller = require('../controllers/messege.controller')
const middleware = require('../middlewares/messege.middleware')
const authencation = require('../middlewares/authencation.middleware')

const router = express.Router()

//GET
router.get('/:conversationId', authencation.login, middleware.isValidMember, controller.getMessege)
router.get('/user/:id', authencation.login, middleware.checkConversation, controller.createConversation)


//POST
router.post('/:conversationId', authencation.login, middleware.isValidMember, controller.createMessege)



//PUT

//DELETE
router.delete('/:conversationId', controller.deleteMessege)



module.exports = router