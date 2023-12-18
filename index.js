const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const { notFound,errorHandler } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');

// const authRoute = require('./routes/authRoutes')

//configuration of database and calling it form config
dbConnect();



app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/api/user', require('./routes/authRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/blog', require('./routes/blogRoutes'))
app.use('/api/prodcategory',require('./routes/prodcategoryRoutes'))
app.use('/api/blogcategory',require('./routes/blogcategoryRouter'))
app.use('/api/brand',require('./routes/brandRouter'))
app.use('/api/color',require('./routes/colorRoutes'))
app.use('/api/coupon', require('./routes/couponRouter'))
app.use('/api/enquiry', require('./routes/enquiryRoutes'))
app.use('/api/upload', require('./routes/uploadRoute'))

app.use(notFound);
app.use(errorHandler);

// app.use('/', (req, res) => {
//     res.send("Welcome to Ecommerce Application")
// }); 

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})   