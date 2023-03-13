const DepositSchema = require('../MODEL/DepositSchema')
const UserSchema = require('../MODEL/UserSchema')
const WithDrawalSchema = require('../MODEL/WithDrawalSchema')
const AmountDepositedSchema = require('../MODEL/AmountDeposited')

class DepositService {
    
    async getDeposits (req,res) {
        const deposits = await DepositSchema.find()
        if(!deposits){
            return res.status(404).json("NO DEPOSITS FOUND")
        }
        res.status(200).json(deposits)
    }
   

    async makeDepositV2 (req,res){
        const {amount, userId} = req.body 
        const user = await UserSchema.findById(userId)
        
        let findAmountDeposit = await AmountDepositedSchema.findOne({user})
        if(!findAmountDeposit){
            return res.status(404).json({message:"NO TRANSACTION LEDGER FOUND!"})
        }
        const balance = findAmountDeposit.balance + amount

            const newAmountDeposit = await AmountDepositedSchema.
            findByIdAndUpdate(findAmountDeposit.id, 
                {$push:{amount}, balance},
                 {new:true})


            const deposit = await DepositSchema.create({amount, userId})

        res.status(200).json({message:"DEPOSIT MADE", deposit, newAmountDeposit}) 
    }

    async getSingleDeposit(req,res) {
        const {depositId} = req.body
        const deposit = await DepositSchema.findById(depositId)
        if(!deposit){
            return res.status(404).json("NO DEPOSITS FOUND")
        }
        res.status(200).json(deposit)
    }

  async getUserDeposit(req,res) {
    const {userId} = req.body 
    const deposits = await DepositSchema.find({user:userId})
    if(!deposits){
        return res.status(404).json("NO DEPOSITS FOUND")
    }
    res.status(200).json(deposits)
  }

  async deleteDeposit(req,res) {
    const {depositId} = req.body 
    await DepositSchema.findOneAndRemove({_id:depositId})
    res.status(200).json({message:"DEPOSIT DELETED"})
  }
  
}

module.exports = new DepositService