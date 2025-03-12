const mongoose = require('mongoose');
const { dbAdmin, dbPassword, dbHost, dbName } = require('../src/config/db.config')

const mongoConnect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=ClusterBack`);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log(error)
    }
}


module.exports = mongoConnect;