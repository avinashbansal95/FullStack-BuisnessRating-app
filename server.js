const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const ejs           = require('ejs');
const engine        = require('ejs-mate');
const session       = require('express-session');
const mongoose      = require('mongoose');
const MongoStore    = require('connect-mongo')(session);




let app       = express();

mongoose.connect('mongodb://localhost/rateme');

app.use(express.static('public'));
app.engine('ejs',engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret           : 'This is my secret',
    resave           : false,
    saveUninitialized: false,
    store            : new MongoStore({mongooseConnection : mongoose.connection})
}))
  


app.get('/',function(req, res, next)
{
    res.render('index');
})




app.listen(3000,() =>
{
    console.log("serevr started at port 3000");
})