const {model, Schema} = require('mongoose')

const AmountDepositedSchema = new Schema ({
    amount:{type:Array},
    balance:{type:Number, default:0},
    user:{ type: Schema.Types.ObjectId, ref:"User" } 
})

module.exports = model('Amount', AmountDepositedSchema)