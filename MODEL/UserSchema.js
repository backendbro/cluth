const {Schema, model} = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const UserSchema = Schema ({
    email:{
        type:String,
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    phoneNumber:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role: {
        type:String,
        default:"User"
    },
    FACode:String,
    FACodeExp:Date,
    isVerifiedAcct:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})


UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
};



UserSchema.methods.createToken = function(){
    const token = jwt.sign({id:this._id}, process.env.secretKey, { expiresIn: process.env.time });
    return token;
}


UserSchema.methods.send2FACode = function(){
    const token = crypto.randomBytes(3).toString('hex')
    this.FACode = token

    this.FACodeExp = Date.now() + 100 * 60 * 1000
    return token
}

module.exports = model('User', UserSchema)