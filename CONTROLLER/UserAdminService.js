const UserSchema = require('../MODEL/UserSchema')
const WithDrawalSchema = require('../MODEL/WithDrawalSchema')
const DepositSchema = require('../MODEL/DepositSchema')

class UserAdminService {

    async getUsers(req,res) {
        const users = await UserSchema.find({role:"User"})
        if(!users){
            return res.status(404).json("NO USERS FOUND")
        }
        res.status(200).json(users)
    }

    async getSingleUser(req,res) {
        
        const user = await UserSchema.findById(req.params.userId)
        if(!user){
            return res.status(404).json("NO USER FOUND")
        }
        res.status(200).json(user)
    }
    
    async deleteUser(req,res) {
        const {userId} = req.body

        let user = await UserSchema.findOne({_id:userId, role:"User"})
        if(!user){
            return res.status(404).json({message:"USER DOES NOT EXIST!"})
        }
        
        user = await UserSchema.findOneAndRemove({_id:userId, role:"User"})
        const withDrawal = await WithDrawalSchema.findOneAndRemove({user})
        const deposits = await DepositSchema.findOneAndRemove({user})
        
        res.status(200).json({user, withDrawal, deposits})
    }

}

module.exports = new UserAdminService