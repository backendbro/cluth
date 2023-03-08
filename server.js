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