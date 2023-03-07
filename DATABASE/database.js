const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const connectDb = async () => {
    const conn = await mongoose.connect(process.env.mongoUri)
    console.log(`MongoDb connected: ${conn.connection.host}`)
}

module.exports = connectDb