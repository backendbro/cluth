const {Schema, model} = require('mongoose')

const WithdrawalSchema = Schema ({
    user:{ 
        type: Schema.Types.ObjectId, ref:'User',
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Pending', 'Failed', 'Confirmed'],
        default:"Pending"
    }
})

module.exports = model("WithDrawal", WithdrawalSchema)