require('dotenv').load();
const express = require("express"),
    app = express(),
    port = 3000 || process.env.PORT,
    SALT_WORK_FACTOR = 10,
    routes = require('./routes/index'),
    authHelpers = require('./helpers/authHelpers'),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    bcryt = require('bcrypt'),
    session = require('cookie-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    knex = require('./db/knex'),
    request = require('request'),
    morgan = require("morgan"); 

app.set('view engine', 'jade');
app.set('views',__dirname + '/views');

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

require('./config/passport')(passport);
app.use(session({secret:process.env.SECRET}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(authHelpers.idUser);
app.use('/users',routes.users);
app.use('/places',routes.places);
app.use('/places/:id/reviews',routes.reviews);

app.use(express.static(__dirname + "/public"));

app.get('/',(req,res) => {
  res.render('site_views/index',{key: process.env.GOOGLE_MAPS_SERVER_KEY});
});

app.post('/login',passport.authenticate('local-signin',{
  successRedirect: '/good1', 
  failureRedirect: '/bad1', 
  failureFlash: true
})
);

app.get('/logout',(req,res) => {
  req.logout();
  res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/success',
                                      failureRedirect: '/failure' }));
  
app.get('*',(req,res) => {
  res.render('site_views/error');
});

app.listen(port,()=> console.log(`Listening on port ${port}`));
module.exports = app;