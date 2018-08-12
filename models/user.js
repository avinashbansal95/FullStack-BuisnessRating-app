const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email   : {type: String},
    password: {type: String},
    role    : {type: String, default: ''},
    company : {
        name :{type : String, default: ''},
        image:{type : String, default: ''}
    },
    passwordResetToken   : {type: String, default: ''},
    passwordResetExpires : {type: Date, default: Date.now},
    facebook: { type: String, default: ''},
    google  : {type:String, default: ''},
       
        tokens: Array
    
})

userSchema.methods.encryptPassword = (password) =>
{
   return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null); 
}

userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User',userSchema);