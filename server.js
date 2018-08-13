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
const secret        = require('./secret/secret.js');
const port          = process.env.port || 3000


let app       = express();

//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/rateme',{ useNewUrlParser: true });

mongoose.connect(secret.mongoURI)

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


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
  });

require('./routes/user')(app, passport);
  require('./routes/company')(app);








app.listen(port,() =>
{
    console.log("serevr started at port 3000");
})