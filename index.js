const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const { notFound,errorHandler } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');

// const authRoute = require('./routes/authRoutes')

//configuration of database and calling it form config
dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/user', require('./routes/authRoutes'))
app.use('/api/product', require('./routes/productRoutes'))

app.use(notFound);
app.use(errorHandler);

// app.use('/', (req, res) => {
//     res.send("Welcome to Ecommerce Application")
// });

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})   