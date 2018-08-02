
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
 if(req.session.cookie.originalMaxAge !== null)
 {
    res.redirect('/home')
 }
 else{
    res.render('index',{title:'Index || Rate Me'});
 }
    
 
    
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
        //successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) =>
{
    if(req.body.rememberme)
    {
        req.session.cookie.maxAge = 30*24*60*60*1000;
    }
    else{
        req.session.cookie.expires = null;
    }
    res.redirect('/home');
})

    app.get('/home',isLoggedIn,(req, res) =>
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
        var success = req.flash('success');
        
        res.render('user/reset', {title: 'Reset Your Password', messages: errors, hasErrors: errors.length > 0,  success:success, noErrors:success.length > 0});
    });
});

app.post('/reset/:token', (req, res) =>
{
   async.waterfall([
       function(callback)
       {
        User.findOne({passwordResetToken:req.params.token, passwordResetExpires: {$gt: Date.now()}}, (err, user) => {
            if(!user){
                req.flash('error', 'Password reset token has expired or is invalid. Enter your email to get a new token.');
                return res.redirect('/forgot');
            }
            //Applying validations

            req.checkBody('password','password is required').notEmpty();
    
            req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
          
            var errors = req.validationErrors();
            if(req.body.password === req.body.cpassword)
            {
                if(errors)
                {
                    var messages = [];
                    errors.forEach(function(error)
                {
                    messages.push(error.msg);
                })
                var errors = req.flash('error',messages);
                var success = req.flash('success',);
                //res.render('user/reset', {title: 'Reset Your Password', messages: error, hasErrors: error.length > 0, success:success, noErrors:success.length > 0});
                res.redirect('/reset/'+req.params.token);
                }
                else{
                    user.password = user.encryptPassword(req.body.password);
                            user.passwordResetToken = undefined;
                            user.passwordResetExpires = undefined;
                            user.save((err) =>
                        {
                            if(err) console.log(err);
                            req.flash('success','Your password is succesfully updated!!');
                            callback(err, user)
                        })
                }
            }

            else{
                req.flash('error','password and confirm password are not equal')
                res.redirect('/reset/'+req.params.token);
            }
            //var success = req.flash('success');
            
            // res.render('user/reset', {title: 'Reset Your Password', messages: errors, hasErrors: errors.length > 0});
        });
       },
      // Sending email

      
      function(user, callback){
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
            subject: 'Your password Has Been Updated.',
            text: 'This is a confirmation that you updated the password for '+user.email
        };
        
        smtpTransport.sendMail(mailOptions, (err, response) => {
            callback(err, user);
            
            var error = req.flash('error');
            var success = req.flash('success');
            
            res.render('user/reset', {title: 'Reset Your Password', messages: error, hasErrors: error.length > 0, success:success, noErrors:success.length > 0});
        });
    }


   ])
});


app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.redirect('/');
    });
})


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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","you need to be logged in first");
    res.redirect("/login");
}