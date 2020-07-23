const router = require('express').Router();
const User = require('../models/User');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

router.get('/', (req,res)=>{
    res.render('forgot');
});

router.post('/', (req,res)=>{
    const {email} = req.body;
    async.waterfall([
        (done)=>{
            crypto.randomBytes(10, (err, buf)=>{
                if (err){
                    console.log("Error in generating Crypto" + err);
                    res.status(500).send("Error in generating Crypto");
                    return 0;
                }
                let token = buf.toString('hex');
                done(null, token);
            });
        },
        (token,done)=>{
            User.findOne({email: email}, (err,user)=>{
                if (err){
                    console.log(" /forgot Post Email Find Error" + err);
                    res.status(500).send("Internal Server Error");
                    return 0;
                }
                if (!user){
                    console.log("Not a registered Email!");
                    res.status(401).send("Not a registered Email ");
                    return 0;
                }
                user.resetPasswordToken = token;
                user.resetPasswordTokenExpiresIn = Date.now() + 1000*60*60;
                user.save((err)=>{
                    if (err){
                        console.log("Saving in DB error" + err);
                        res.status(500).send("Internal Server Error");
                        return 0;
                    }
                })
                done(null, token, user);
            });
        },
        (token,user,done)=>{
            let transporter = nodemailer.createTransport({
                host: 'smtp.googlemail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_AUTH_USER,
                    pass: process.env.SMTP_AUTH_PASS
                }
            });
            let mailOptions = {
                from: process.env.MAILOPT_FROM,
                to: process.env.MAILOPT_TO,
                subject: "Password Reset Request",
                html: "Click on the link below to create a new Password <br/>" + 'http://' + req.headers.host + '/reset/' + token  +"<br/> <strong>If you did not initiate this request. Please contact our costumer support and reset your password</strong>"
            
            }
            transporter.sendMail(mailOptions, (err, info)=>{
                if (err){
                    console.log("Sending Mail Error in POST /forgot", err);
                    res.status(500).send("Internal Server Error");
                    return 0;
                }
                console.log("Successfully Sent Message: " + info);
            });
            res.redirect('/forgot/sentmail');
        }
    ], (err)=> {
        console.log("Async Callback Error in POST /forgot" + err);
    }); 
});

router.get('/sentmail', (req,res)=>{
    res.send("<h1 style='color: green;'>Email is sent to your address. Click the link to reset new Password</h1>");
});



module.exports = router;