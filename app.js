const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//Create MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true, useNewUrlParser: true},
    (err)=>{
        if (err){
            console.log("Mongo Error: ", err);
            return 0;
        }
        console.log("Mongoose Up and Running!");
    }
);

//Setting up EJS, BodyParser, CookieParser, Static Pages, and Express Session

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000*60*60
    }
}));

//Route Middleware
app.use('/', require('./routes/login'));
app.use('/forgot', require('./routes/forgot'));
app.use('/reset', require('./routes/reset'));


//Server Initiation
app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server Started on port ${process.env.PORT}`);
});

