const express = require('express')
const controller = require('../controllers/authencation.controller')
const router = express.Router()


router.post('/regist', controller.regist)
router.post('/sendOTP/:type', controller.sendOTP)
router.post('/login', controller.login)
router.put('/changePassword', controller.changePassword)


// router.post('/', controller.add)
// router.put('/enable/:id', controller.enable)
// router.put('/disable/:id', controller.disable)



module.exports = router