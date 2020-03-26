const express         = require('express');
const expressLayout   = require('express-ejs-layouts');
const mongoose        = require('mongoose');
const passport        = require('passport');
const session         = require('express-session');
const flash           = require('connect-flash');



//passport config

require('./config/passport')(passport);




//Connet to mongo
mongoose
  .connect(
    'mongodb://localhost:27017/authNode',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();
// express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


app.use(flash());

//global vars

app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.err_msg = req.flash('err_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  //for the passport message 
  res.locals.error = req.flash('error');
  next();
})

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/',require('./Routes/index'));
app.use('/users',require('./Routes/users'));














const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('App listening on port 3000!');
});