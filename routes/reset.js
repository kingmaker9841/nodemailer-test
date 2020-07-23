const router = require('express').Router();
const User = require('../models/User');
const async = require('async');
const nodemailer = require('nodemailer');


// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

router.get('/:token', (req,res)=>{
    res.render('reset');
});

router.post('/:token', (req,res)=>{
    const {password} = req.body;

    async.waterfall([
        (done)=>{
            User.findOne({resetPasswordToken: req.params.token, 
                resetPasswordTokenExpiresIn: { $gt : Date.now()}}, (err,user)=>{
                    if (err){
                        console.log("Error in POST /reset/:token while FInding : " + err);
                        res.status(500).send("Internal Server Error:");
                        return 0;
                    }
                    user.password = password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordTokenExpiresIn = undefined;
                    user.save((err)=>{
                        if (err){
                            console.log("Error while Saving during /reset/:token " + err);
                            res.status(500).send("Internal Server Error");
                            return 0;
                        }
                    })
                    done(null, user);
                });
        },
        (user,done)=>{
            let transporter = nodemailer.createTransport({
                host: 'smtp.googlemail.com',
                port : 465,
                secure : true,
                auth : {
                    user: process.env.SMTP_AUTH_USER,
                    pass : process.env.SMTP_AUTH_PASS
                }
            });
            let mailOptions = {
                from : process.env.MAILOPT_FROM,
                to : process.env.MAILOPT_TO,
                subject : "Successfully Updated Your Password",
                text: "Click the link below to redirect towards the login page \n" + 'http://' + req.headers.host,
                html: "<strong style='color:green;'>Thank you For using our services.</strong>"         
            }
            transporter.sendMail(mailOptions, (err,info)=>{
                if (err){
                    console.log("Error during sending mail in POST /reset/:token" + err);
                    res.status(500).send("Internal Server Error");
                    return 0;
                }
                console.log("Successfully sent Updated Message to Client" + info);
                res.redirect('/?success=true');
            })
        }
    ], (err)=>{
        console.log("Error in POST /reset/:token" + err);
        res.status(500).send("Async Error");
    })
});


module.exports = router;