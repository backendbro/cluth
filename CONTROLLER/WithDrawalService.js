const sendEmail = require('../ULTIS/email')
const UserSchema = require('../MODEL/UserSchema')
const WithDrawalSchema = require('../MODEL/WithDrawalSchema')
const DepositSchema = require('../MODEL/DepositSchema')
const mongoose = require("mongoose")


class WithDrawalService {
    async withDrawalRequest (req,res) {
        const user = await UserSchema.findById(req.user.id)
      
        const {username} = user
        const {amount} = req.body

        const adminEmail = "backendbomafiaso@gmail.com"
        const withDrawalRequestObj = {user:user._id, amount}


        await WithDrawalSchema.create(withDrawalRequestObj)
        await sendEmail(adminEmail,  "Withdrawal Request", {username, amount})
        
        res.status(200).json({message:"AN ERROR OCCURED: CONTACT THE ADMIN"})
    }

    async getWithDrawalRequests(req,res) {
        const withDrawalRequests = await WithDrawalSchema.find()
        if(!withDrawalRequests){
            return res.status(404).json("NO WITHDRAWAL REQUESTS YET")
        }
        
        res.status(200).json({withDrawalRequests})
    }

    async getWithDrawalRequestsForOneUser(req,res) {
        
        const {userId} = req.body
        const Id = mongoose.Types.ObjectId(userId);
        
        const withDrawalRequests = await WithDrawalSchema.find({user:Id})
        if(!withDrawalRequests){
            return res.status(404).json("THIS USER DOES NOT ANY WITHDRAWAL REQUESTS YET")
        }
        
        res.status(200).json({withDrawalRequests})
    }
    
    async getSingleWithDrawalRequests(req,res) {
        const {withDrawalId} = req.body
        const withDrawalRequest = await WithDrawalSchema.findById(withDrawalId)
        if(!withDrawalRequest){
            return res.status(404).json("WITHDRAWAL REQUEST DOES NOT EXIST")
        }
        
        res.status(200).json({withDrawalRequest})
    }

    async confirmWithDrawalRequest(req,res) {
        const {userId, status, withDrawalId} = req.body
        const userObjectId = mongoose.Types.ObjectId(userId);

        const user = await UserSchema.findById(userId)
        let withDrawalRequest = await WithDrawalSchema.findOne({_id: withDrawalId, status : "Pending"})
        let deposit = await DepositSchema.findOne({user:userObjectId})

        if(!withDrawalRequest){
            return res.status(404).json({message:"ALREADY CONFIRMED"})
        }
        
        if(!deposit){
            return res.status(404).json({message:"NO DEPOSIT YET!"})
        }

        const withdrawalAmount = withDrawalRequest.amount 
        const depositBalance = deposit.balance

            
        if(withdrawalAmount > depositBalance ){
            return res.status(404).json({message:"INSUFFICIENT FUNDS"})
        }

        const remainingBalance = depositBalance - withdrawalAmount
       
        withDrawalRequest = await WithDrawalSchema.findByIdAndUpdate(withDrawalRequest._id, {status}, {new:true})
        deposit = await DepositSchema.findByIdAndUpdate(deposit._id, {balance: remainingBalance}, {new:true})

        res.status(200).json({withDrawalRequest, deposit})
    
    } 
}

module.exports = new WithDrawalService