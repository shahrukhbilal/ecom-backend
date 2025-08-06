const mongoose= require('mongoose')

const dbconnection= async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Mongodb connected')
    })
    .catch((error)=>{
        console.log('error to connect with mongodb ', error)
    })
}
module.exports= dbconnection;