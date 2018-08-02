const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const validator     = require('express-validator');
const ejs           = require('ejs');
const engine        = require('ejs-mate');
const session       = require('express-session');
const mongoose      = require('mongoose');
const MongoStore    = require('connect-mongo')(session);
const passport      = require('passport');
const flash         = require('connect-flash');


let app       = express();

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/rateme',{ useNewUrlParser: true });

require('./config/passport')
require('./secret/secret')

app.use(express.static('public'));

app.engine('ejs',engine);
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//after bodyparese middleware
app.use(validator());

app.use(session({
    secret           : 'This is my secret',
    resave           : false,
    saveUninitialized: false,
    store            : new MongoStore({mongooseConnection : mongoose.connection})
}));

//Pssport middleware should be used after seesion

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

require('./routes/user')(app, passport);
  








app.listen(3000,() =>
{
    console.log("serevr started at port 3000");
})