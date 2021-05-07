var express = require('express');
var app = express();
require('dotenv').config();
const expressListRoutes = require('express-list-routes');
var cookieParser = require('cookie-parser');
var path = require('path');
const cors = require('cors')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoDBSession = require('connect-mongodb-session')(session)

var authRouter = require('./routes/auth');
var mailRouter = require('./routes/mail');
var geoRouter = require('./routes/fahed/geoPoints');
var usersRouter = require('./routes/fahed/users');
var companiesWaitRouter = require('./routes/fahed/companiesWait');

app.use(express.json());
app.use(express.static('frontend/build'))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin : process.env.URLCORS , credentials : true}))

mongoose.connect('mongodb+srv://admin:admin@mabase.jnjfd.mongodb.net/mabase?retryWrites=true&w=majority' , {
  useNewUrlParser : true,
  useCreateIndex : true,
  useUnifiedTopology : true
}).then(res =>console.log('je suis connecter avec mongo'))
mongoose.set('useFindAndModify', false);
const store = new MongoDBSession({
  uri : 'mongodb+srv://admin:admin@mabase.yc6od.mongodb.net/mabase?retryWrites=true&w=majority',
  collection : 'mySession'
})

app.use(session({
    secret : "key to sign in",
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 24*60*60000,
        httpOnly: false,
    },
    store : store
  }))
  
  
  app.use('/users', usersRouter);
  app.use('/compwait', companiesWaitRouter);
  app.use('/auth', authRouter);
  app.use('/mail', mailRouter);
  app.use('/geo', geoRouter);

app.get('/api/youtube',(req,res)=>{
    res.send('hello we are there')
})



const PORT = process.env.PORT || 7000
app.listen(PORT,()=>{
    console.log(`le serveur est lancé sur ${PORT}`)
})
app.get('/*',(_,res)=>{
  res.sendFile(path.join(__dirname,'./frontend/build/index.html'))
})
expressListRoutes(app, { prefix: '' });