const router = require('express').Router()
const DepositService = require('../CONTROLLER/DepositService')
const {protect, auth} = require('../MIDDLEWARES/protect')

router.use(protect)

router.get('/', DepositService.getDeposits) 
router.post("/",  auth("Admin"), DepositService.makeDeposit)
router.get('/single-deposit', DepositService.getSingleDeposit)

module.exports = router