const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let User            = require('../models/user')

passport.serializeUser((user, done) =>
{
   done(null, user.id)
});

passport.deserializeUser((id, done) =>
{
   user.findById(id,(err, user) =>
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
        return done(null, false);
    }

    let newUser = new User();
    newUser.username = req.body.username;
    newUser.email    = req.body.email;
    newUser.password = encryptPassword(req.body.password);

    newUser.save((err) =>
{
   return done(null, newUser)
})
})
}))

