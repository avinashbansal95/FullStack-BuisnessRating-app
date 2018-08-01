const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let User            = require('../models/user')

passport.serializeUser((user, done) =>
{
   done(null, user.id)
});

passport.deserializeUser((id, done) =>
{
   User.findById(id,(err, user) =>
{
     done(err, user);
})
});

passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, //it passes data to callback
},(req, email, password, done) =>
{
    User.findOne({'email':email},(err, user) =>
{
    if(err) return done(err);
    if(user)
    {
        return done(null, false,req.flash('error','Email already exists'));
    }

    let newUser = new User();
    newUser.username = req.body.username;
    newUser.email    = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);

    newUser.save((err) =>
{
    req.flash('success','Well done! You have successfully regisitered')
 
   return done(null, newUser)
})
})
}))

//login passport strategy

passport.use('local.login',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, //it passes data to callback
},(req, email, password, done) =>
{
    User.findOne({'email':email},(err, user) =>
{
    if(err) return done(err);
    var messages = []
    if(!user || !user.validPassword(password))
    {
        messages.push("Email and password doesn't match")
        return done(null, false, req.flash('error',messages));
    }
req.flash('success','You are logged in successfully')
return done(null, user);
   
})
}))

