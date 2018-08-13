const passport      = require('passport');
const LocalStrategy    = require('passport-local').Strategy;
let User               = require('../models/user')
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy   = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const secret = require('../secret/secret')

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


passport.use(new FacebookStrategy(secret.facebook, (token, refreshToken, profile, done) => {
    User.findOne({facebook:profile.id}, (err, user) => {

        console.log('token',token);
        console.log('refreshtoken',refreshToken);
        console.log('profile',profile);

        if(err){
            return done(err);
        }

        if(user){
            console.log(user);
            done(null, user);
        }else{
            var newUser = new User();
            newUser.facebook = profile.id;
            newUser.username = profile.displayName;
            newUser.email =profile._json.email;
            newUser.tokens.push({token:token});

            newUser.save(function(err) {
                if(err){
                    console.log(err);
                }
                console.log(newUser);
                done(null, newUser);
            });
        }
    })
}));



passport.use(new GoogleStrategy(secret.google, (token, refreshToken, profile, done) => {
    User.findOne({google:profile.id}, (err, user) => {

        console.log('token',token);
        console.log("###########");
        console.log('refreshtoken',refreshToken);
        console.log("###########");

        console.log('profile',profile);
        console.log("###########");

        if(err){
            return done(err);
        }

        if(user){
            console.log(user);
            done(null, user);
        }else{
            var newUser = new User();
            newUser.google = profile.id;
            newUser.username = profile.displayName;
            newUser.email =profile._json.email || profile.emails[0].value;
            newUser.tokens.push({token:token});

            newUser.save(function(err) {
                if(err){
                    console.log(err);
                }
                console.log(newUser);
                done(null, newUser);
            });
        }
    })
}));

//passport-linkedin strategy


passport.use(new LinkedInStrategy(secret.linkedin, (token, refreshToken, profile, done) => {
    User.findOne({linkedin:profile.id}, (err, user) => {

        console.log('token',token);
        console.log("###########");
        console.log('refreshtoken',refreshToken);
        console.log("###########");

        console.log('profile',profile);
        console.log("###########");

        if(err){
            return done(err);
        }

        if(user){
            console.log(user);
            done(null, user);
        }else{
            var newUser = new User();
            newUser.linkedin = profile.id;
            newUser.username = profile.displayName;
            newUser.email    = profile._json.email || profile.emails[0].value;
            newUser.tokens.push({token:token});

            newUser.save(function(err) {
                if(err){
                    console.log(err);
                }
                console.log(newUser);
                done(null, newUser);
            });
        }
    })
}));


