const UserSchema = require('../MODEL/UserSchema')
const mongoose = require('mongoose')
const sendEmail = require('../ULTIS/email')

class UserService {

    async register(req,res) {
        const {email, username, password} = req.body 
        let user = await UserSchema.findOne({email})
        
        if(user){
            return res.status(404).json({message:"USER ALREADY EXIST"})
        }

        user = await UserSchema.create({email, username, password})
        
        const token = user.createToken()
        const pin = user.send2FACode()
        await user.save()

        sendEmail(email, "Domicion Verification Code", {username, pin, request:"Verification of Email"})
       
        res.status(202).json({user, token, pin})
    }


    async resendConfirmPin (req,res) {
        const {email} = req.body
        const user = await UserSchema.findOne({email})
        if(!user){
            return res.status(404).json({message:'ENTER YOUR SIGN IN EMAIL'})
        }

        const username = user.username
        const pin = user.send2FACode()
        
        await user.save()
        await sendEmail(email, 'Resend Code', { username, pin, request:"Resending of pin" });

        res.status(200).json({message: "TOKEN RESENT"})
    }


    async confirmPin(req,res) {
        const {pin} = req.body
        
        const user = await UserSchema.findOne({
            FACode:pin,
            FACodeExp:{ $gt: Date.now() }
        })
        
        if(!user){
            return res.status(200).json({message:"INVALID TOKEN"})
        }

        user.FACode = undefined
        user.FACodeExp = undefined
        
        user.isVerifiedAcct = true  
        await user.save()
        
        
        res.status(200).json({message:'EMAIL VERIFIED'})
    }

    async login (req,res) {
        const {email, password} = req.body 
        let user = await UserSchema.findOne({email}).select("+password")
        
        if(!user){
            return res.status(404).json({message:"EMAIL DOES NOT EXIST"})
        }

        const matchPassword = await user.comparePassword(password, user.password)
        if(!matchPassword){
            return res.status(404).json({message: "PASSWORD DOES NOT MATCH"})
        }

        const token = user.createToken()
        res.status(200).json({user, token})
    }


    async forgotPassword (req,res) {
        const {email} = req.body 
        const user = await UserSchema.findOne({email})
        
        if(!user){
            return res.status(404).json({message: 'WRONG CREDENTIAL'})
        }
        
        const username = user.username
        const pin = user.send2FACode()
        await user.save()

        await sendEmail(email, 'Reset Password', { username, pin, request:"Forgot Password Recovery" });

        res.status(200).json({message:'RESET PASSWORD LINK SENT TO THIS EMAIL', pin})
   
    }

    async resetPassword (req,res) {
        const { password,pin } = req.body
        
        const user = await UserSchema.findOne({
            FACode:pin,
            FACodeExp:{ $gt: Date.now() }
        })
        
        if(!user){
            return res.status(200).json({message:"TOKEN EXPIRED"})
        }

        user.FACode = undefined
        user.FACodeExp = undefined
        user.password = password
        await user.save()

        res.status(200).json({message:'PASSWORD CHANGED'})
    }


    async resetCurrentPassword(req,res){
        const {currentPassword, newPassword} = req.body
        
        const user = await UserSchema.findById(req.user.id).select('+password')
        
        if(!user){
            return res.status(404).json({message: 'USER DOES NOT EXIST'})
        }
       
        const isMatch = await user.comparePassword(currentPassword,user.password)
        if(!isMatch){
            return res.status(404).json({message: 'INCORRECT PASSWORD'})
        }

        user.password = newPassword
        await user.save()

        res.status(200).json({message:"PASSWORD CHANGED", user})
    }
    

}

module.exports = new UserService

