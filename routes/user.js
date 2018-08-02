
const nodemailer    = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
const async         = require('async');
const crypto        = require('crypto');
let User            = require('../models/user');
const secret        = require('../secret/secret')
module.exports = (app,passport) =>
{
   
app.get('/',function(req, res, next)
{
    // var msg = req.flash('success');
    // console.log(msg);

    res.render('index',{title:'Index || Rate Me'});
})
    app.get('/signup',(req, res) =>
    {
        var errors = req.flash('error');
        console.log(errors);
        res.render('user/signup',{title:'Sign up || Rate Me',messages:errors, hasErrors:errors.length > 0})
    });

   app.post('/signup',validate,passport.authenticate('local.signup',{
       successRedirect: '/home',
       failureRedirect: '/signup',
       failureFlash: true
   }))

    app.get('/login',(req, res) =>
    {
        var errors = req.flash('error');
        console.log(errors);
        res.render('user/login',{title:'Login || Rate Me',messages:errors, hasErrors:errors.length > 0})
    });

    app.post('/login',validateLogin,passport.authenticate('local.login',{
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }))

    app.get('/home',(req, res) =>
{
    var msg = req.flash('success');

    console.log(msg);

    res.render('home',{title:'Home || Rate Me',messages: msg })
})
app.get('/forgot',(req, res) =>
{
    var errors = req.flash('error');
    var info = req.flash('info');
    res.render('user/forgot',{title:'Request Password Reset',messages:errors, hasErrors:errors.length > 0,
    info:info, noErrors:info.length > 0});
})

//original one

app.post('/forgot', (req, res, next) => {
    async.waterfall([
        function(callback){
            crypto.randomBytes(20, (err, buf) => {
                var rand = buf.toString('hex');
                callback(err, rand);
            });
        },
        
        function(rand, callback){
            User.findOne({'email':req.body.email}, (err, user) => {
                if(!user){
                    req.flash('error', 'No Account With That Email Exist Or Email is Invalid');
                    return res.redirect('/forgot');
                }
                
                user.passwordResetToken = rand;
                user.passwordResetExpires = Date.now() + 60*60*1000;
                
                user.save((err) => {
                    callback(err, rand, user);
                });
            })
        },
        
        function(rand, user, callback){
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                secure: false,
                auth: {
                    user: secret.auth.user,
                    pass: secret.auth.pass
                },
                tls:{
                    rejectUnauthorized : false
                }
            });
            
            var mailOptions = {
                to: user.email,
                from: 'RateMe '+'<'+secret.auth.user+'>',
                subject: 'RateMe Application Password Reset Token',
                text: 'You have requested for password reset token. \n\n'+
                    'Please click on the link to complete the process: \n\n'+
                    'http://localhost:3000/reset/'+rand+'\n\n'
            };
            
            smtpTransport.sendMail(mailOptions, (err, response) => {
               req.flash('info', 'A password reset token has been sent to '+user.email);
                return callback(err, user);
            });
        }
    ], (err) => {
        if(err){
            return next(err);
        }
        
        res.redirect('/forgot');
    })
});

//Password Reset route

app.get('/reset/:token', (req, res) => {
        
    User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
        if(!user){
            req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
            return res.redirect('/forgot');
        }
        var errors = req.flash('error');
        //var success = req.flash('success');
        
        res.render('user/reset', {title: 'Reset Your Password', messages: errors, hasErrors: errors.length > 0});
    });
});

}

function validate(req, res, next){
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','Invalid email').isEmail();
    req.checkBody('password','password is required').notEmpty();
    
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    var errors  = req.validationErrors();
   
    if(errors)
    {
        var messages = [];
        errors.forEach((error) =>
    {
        messages.push(error.msg);
    });

      req.flash('error', messages);
      res.redirect('/signup')
    }
    else{
        
       return next();
    }

  
}

function validateLogin(req, res, next) 
{
    
    req.checkBody('email','Email field is empty').notEmpty();
    req.checkBody('password','password field is empty').notEmpty();
    var errors  = req.validationErrors();
   
    if(errors)
    {
        var messages = [];
        errors.forEach((error) =>
    {
        messages.push(error.msg);
    });

      req.flash('error', messages);
      res.redirect('/login')
    }
    else{
        
       return next();
    }
}

