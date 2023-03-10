const router = require('express').Router()
const WithDrawalService = require('../CONTROLLER/WithDrawalService')
const {protect, auth } = require('../MIDDLEWARES/protect')

router.use(protect)

router.post('/request', auth("User"),WithDrawalService.withDrawalRequest)
router.get('/', WithDrawalService.getWithDrawalRequests)
router.post('/single-user', WithDrawalService.getWithDrawalRequestsForOneUser)
router.get('/single-withdraw', auth("Admin"), WithDrawalService.getSingleWithDrawalRequests)
router.put('/confirm-withdraw', auth("Admin"), WithDrawalService.confirmWithDrawalRequest)

module.exports = router