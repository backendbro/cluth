const nodemailer = require("nodemailer");
const { 
   verifyEmailTemplate, 
   forgotPasswordTemplate, 
   fA2AuthTemplate,
   adminMessageTemplate,
   ContactWithDrawalUser,
   withDrawalRequestTemplate
  } = require('../EMAIL-VIEWS/index')

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.gmailUsername, 
      pass: process.env.gmailPassword
    }
  });

  // Remember to refactor the payload code

  const sendEmail = async (to, subject, payload, userFrom=null) => {
  let template;
  const {username, pin, request} = payload 

  if(subject == 'Domicion Verification Code'){
   template = verifyEmailTemplate({username, pin, request})
  }

  else if (subject == 'Reset Password'){
    template = forgotPasswordTemplate({username, pin, request})
  }

  else if(subject == "Request of WithDrawal") {
    const {username, message, request} = payload 
    template = ContactWithDrawalUser({username, message, request})
  }
  
  else if(subject == "Resend Code"){
    template = fA2AuthTemplate({username, pin, request})
  }
  
  else if (subject == "Follow up on of Request of WithDrawal"){
    const {username, message, request} = payload 
    template = adminMessageTemplate({username, message, request})
  }

  else if (subject == "Withdrawal Request") {
    const {username, amount } = payload
    template = withDrawalRequestTemplate({username, amount})
  }

  const info = {
    from: "support@kucoinoptions.live",
    to,
    subject,
    html:template
  }

  await transporter.sendMail(info)
}

module.exports = sendEmail
