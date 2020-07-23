const router = require('express').Router();
const User = require('../models/User');

router.get('/', (req,res)=>{
    res.render('login');
});

router.post('/', (req,res)=>{
    new User({
        email: req.body.email,
        password: req.body.password
    }).save().then((user)=> {
        console.log(user);
        res.redirect('/?success');
    });
});

module.exports = router;

