const {Schema, model} = require('mongoose')

const DepositSchema = Schema({
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    user:{ type: Schema.Types.ObjectId, ref:"User" }
}, {timestamps:true})



module.exports = model('Deposit', DepositSchema)