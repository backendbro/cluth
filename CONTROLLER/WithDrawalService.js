const sendEmail = require('../ULTIS/email')
const UserSchema = require('../MODEL/UserSchema')
const WithDrawalSchema = require('../MODEL/WithDrawalSchema')
const DepositSchema = require('../MODEL/DepositSchema')
const mongoose = require("mongoose")
const AmountDeposited = require('../MODEL/AmountDeposited')


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
        const withDrawalRequests = await WithDrawalSchema.find({user:userId})
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
    
        let withDrawalRequest = await WithDrawalSchema.findOne({_id: withDrawalId, status : "Pending"})
        let amountPaid = await AmountDeposited.findOne({user:userId})

        if(status !== "Confirmed"){
            const failedRequest = await WithDrawalSchema.findByIdAndUpdate(withDrawalRequest._id, {status}, {new:true})
            return res.status(404).json({failedRequest})
        }

        if(!withDrawalRequest){
            return res.status(404).json({message:"ALREADY CONFIRMED"})
        }
      

        const withdrawalAmount = withDrawalRequest.amount 
        const amountPaidBalance = amountPaid.balance

            
        if(withdrawalAmount > amountPaidBalance ){
            return res.status(404).json({message:"INSUFFICIENT FUNDS"})
        }


        const remainingBalance = amountPaidBalance - withdrawalAmount
       
        withDrawalRequest = await WithDrawalSchema.findByIdAndUpdate(withDrawalRequest._id, {status}, {new:true})
        amountPaid = await AmountDeposited.findByIdAndUpdate(amountPaid._id, {balance: remainingBalance}, {new:true})

        res.status(200).json({withDrawalRequest, amountPaid})
    
    } 
}

module.exports = new WithDrawalService