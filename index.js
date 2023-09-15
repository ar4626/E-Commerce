const express = require ('express');
const app = express();
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect');
const PORT = process.env.PORT || 4000;

//configuration of database and calling it form config
dbConnect();

app.use('/', (req,res) => {
    res.send("Welcome to Ecommerce Application")
});

app.listen(PORT,() => {
    console.log(`Server is running at Port ${PORT}`);
})