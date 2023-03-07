const {Schema, model} = require('mongoose')

const DepositSchema = Schema({
    amount:{type:Array},
    balance:{type:Number, default:0},
    user:{ type: Schema.Types.ObjectId, ref:'User'} 
}, {timestamps:true})



module.exports = model('Deposit', DepositSchema)