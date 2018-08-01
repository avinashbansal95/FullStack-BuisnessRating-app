module.exports = (app) =>
{
   
app.get('/',function(req, res, next)
{
    res.render('index',{title:'Index || Rate Me'});
})
    app.get('/signup',(req, res) =>
    {
        res.render('user/signup',{title:'Sign up || Rate Me'})
    });
    app.get('/login',(req, res) =>
    {
        res.render('user/login',{title:'Login || Rate Me'})
    });
}