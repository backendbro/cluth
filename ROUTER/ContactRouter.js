const router = require('express').Router()
const ContactService = require('../CONTROLLER/ContactService')
const {protect, auth } = require('../MIDDLEWARES/protect')

router.use(protect)

router.post('/user', auth("User"), ContactService.userMessenger)
router.post('/admin', auth("Admin"), ContactService.adminMessenger)

module.exports = router

