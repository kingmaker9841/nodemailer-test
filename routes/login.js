const router = require('express').Router();
const User = require('../models/User');

router.get('/', (req,res)=>{
    res.render('login');
});

router.post('/', (req,res)=>{
    const {email,password} = req.body;
    User.findOne({email: email}, (err,user)=>{
        if (err){
            console.log(" / Post Email Find Error" + err);
            res.status(500).send("Internal Server Error");
            return 0;
        }
        if (!user){
            console.log("Not a registered Email!");
            res.status(401).send("Not a registered Email ");
            return 0;
        }
        if (user.password != password){
            console.log("Password Incorrect");
            res.status(401).send("Incorrect Password");
            return 0;
        }
        res.send("<h1 style='color: green'>Successfully Logged In</h1>");
    });
});

module.exports = router;

