const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const app = express();

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


//Server Initiation
app.listen(process.env.PORT || 5000, ()=>{
    console.log(`Server Started on port ${process.env.PORT}`);
});

