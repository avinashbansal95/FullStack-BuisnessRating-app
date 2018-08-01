module.exports = (app,passport) =>
{
   
app.get('/',function(req, res, next)
{
    var msg = req.flash('success');
    console.log(msg);

    res.render('index',{title:'Index || Rate Me',messages:msg});
})
    app.get('/signup',(req, res) =>
    {
        var errors = req.flash('error');
        console.log(errors);
        res.render('user/signup',{title:'Sign up || Rate Me',messages:errors, hasErrors:errors.length > 0})
    });

   app.post('/signup',validate,passport.authenticate('local.signup',{
       successRedirect: '/',
       failureRedirect: '/signup',
       failureFlash: true
   }))

    app.get('/login',(req, res) =>
    {
        var errors = req.flash('error');
        console.log(errors);
        res.render('user/login',{title:'Login || Rate Me',messages:errors, hasErrors:errors.length > 0})
    });

    app.post('/login',passport.authenticate('local.login',{
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

