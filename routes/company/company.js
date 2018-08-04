
const formidable = require('formidable');
const path       = require('path');
const fs         = require('fs');

module.exports = (app) =>
{
    app.get('/company/create',isLoggedIn,(req, res) =>
{
    res.render('company/company',{title:'Company Registration'})
})


app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    
    form.uploadDir =  './uploads';
    form.on('file', (field, file) => {
       fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
           if(err){
               console.log(err);
           }
           
           console.log('File has been renamed');
       }); 
    });
    
    form.on('error', (err) => {
        console.log('An error occured', err);
    });
    
    form.on('end', () => {
        console.log('File upload was successful');
    });
    
    form.parse(req);
    
});
}


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","you need to be logged in first");
    res.redirect("/login");
}