const mongoose = require('mongoose');

const dbConnect = () => {
    try {
        const conn = mongoose.connect('mongodb+srv://ar2646:ar2646@mern.rqinryr.mongodb.net/');
        console.log('Connected to the database Successfully');
    }
    catch(error){
        console.log('Error connecting to the database');
    }
};

module.exports = dbConnect;