
const coins = {
    Bitcoin:{
        name:"BTC",
        img:"https://assets-currency.kucoin.com/60bf8a90db892b0006d73786_BTC.png",
        network:{
            BTC:{
                name: "Bitcoin(BTC)",
                Recipient_Account:"user.username",
                Deposit_Confirmation:"2_blocks",
                Minimum_Amount: "0.00005BTC",
                Description:"Confirm that your network is BTC(Bitcoin).",
                address:"3AaLcXdUB6XSFKybU84BiZd5gmk1fusisR"
            }
        }
    },
    USDT:{
        name:"tether",
        img:"3AaLcXdUB6XSFKybU84BiZd5gmk1fusisR",
        network:{
            TRX:{
                name: "Tron(TRC20)",
                Recipient_Account:"user.username",
                Deposit_Confirmation:"2_blocks",
                Minimum_Amount: "0.00005BTC",
                Description:"Confirm that your network is BTC(Bitcoin).",
                address:"3AaLcXdUB6XSFKybU84BiZd5gmk1fusisR"
            }
        }

    }

}


return 
const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./DATABASE/database')
const cors = require('cors')

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


connectDb()

app.get('/', (req,res) => res.json('Still Alive!'))

// bring in routes 
const auth = require('./ROUTER/UserRouter')
const payment = require('./ROUTER/UserAdminRouter')
const deposit = require('./ROUTER/DepositRouter')
const withdrawal = require('./ROUTER/WithDrawalRouter');
const contact = require('./ROUTER/ContactRouter')

// mount routes 
app.use('/api/auth', auth)
app.use('/api/user', payment)
app.use('/api/deposit', deposit)
app.use('/api/withdrawal', withdrawal)
app.use('/api/contact', contact)

const port = process.env.PORT || 8080 
app.listen(port, () => {
    console.log(`port started on http:localhost:${port}`)
})