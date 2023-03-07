const UserSchema = require('../MODEL/UserSchema');
const sendEmail = require('../ULTIS/email')

class ContactService {

    async userMessenger (req,res) {
        const {username} = req.user
        const {email, message} = req.body 
        await sendEmail(email, 'Request of WithDrawal', { username, message, request:"WithDrawal of Funds"});
        res.status(200).json({message:"MESSAGE SENT!"})
    }

    async adminMessenger(req,res) {
        const {email, message, userId} = req.body 
        const {username} = await UserSchema.findById(userId)
        await sendEmail(email, 'Follow up on of Request of WithDrawal', { username, message, request:"WithDrawal of Funds"});
        res.status(200).json({message:"MESSAGE SENT!"})
    }

    
}

module.exports = new ContactService