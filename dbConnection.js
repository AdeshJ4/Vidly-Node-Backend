const mongoose = require('mongoose');
const debug = require("debug")("app:startup");

const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        debug('Database Connected ' + '\tHost: ', connect.connection.host + '\tDB_name: ', connect.connection.name );
    }catch(err){
        debug('Error: ', err.message);
        process.exit(1);        
    }
} 

module.exports = connectDB