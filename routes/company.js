
const formidable = require('formidable');
const path       = require('path');
const fs         = require('fs');
let Company      = require('../models/company')

module.exports = (app) =>
{
    app.get('/company/create',isLoggedIn,(req, res) =>
{

    
    var success = req.flash('success');
    var errors   = req.flash('error');
    console.log(success);
    res.render('company/company',{title:'Company Registration',messages: errors, hasErrors: errors.length > 0,  success:success, noErrors:success.length > 0})
})




app.post('/company/create', (req, res) =>
{
   var newCompany = new Company();

   newCompany.name = req.body.name
   newCompany.address = req.body.address
   newCompany.city = req.body.city
   newCompany.country = req.body.country
   newCompany.sector = req.body.sector
   newCompany.website = req.body.website;
   newCompany.image = req.body.upload;

   newCompany.save((err,companyData) =>
{
    if(err){
        console.log(err);
        req.flash('error','An error occured while saving data,try again');
    }

    console.log(companyData);
    req.flash('success','company data added successfully');
    res.redirect('/company/create');
})

})





app.post('/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    
    form.uploadDir =  './public/uploads';
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