const router = require('express').Router()
const DepositService = require('../CONTROLLER/DepositService')
const {protect, auth} = require('../MIDDLEWARES/protect')

// router.use(protect)

router.post('/get-all', DepositService.getDeposits) 
router.post("/",  auth("Admin"), DepositService.makeDeposit)
router.post('/single-deposit', DepositService.getSingleDeposit)
router.post('/user-deposit', DepositService.getUserDeposit)
module.exports = router