const mongoose = require('mongoose');
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MongoDB_URL);
        console.log('Connected to the database Successfully');
    }
    catch(error){
        console.log('Error connecting to the database');
    }
};

module.exports = dbConnect; 