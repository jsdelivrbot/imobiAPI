const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
//var User = require('./app/models/user/user');

/*express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))*/

  // =======================
// configuration =========
// =======================
var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
//app.set('username', config.username)
//app.set('password', config.password); // secret variable
mongoose.connect(config.database); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('secret', config.secret);

// use morgan to log requests to the console
app.use(morgan('dev'));

//var apiRoutes = express.Router(); 
//app.use('/api', apiRoutes);

// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //next(); // make sure we go to the next routes and don't stop here

    debugger;
    if (req.originalUrl == '/authenticate') {
        next();
        return;
    }

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'someSecretHere'/*app.get('secret')*/, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;    
                next();
            }
        });
    } else {
 
     // if there is no token
     // return an error
     return res.status(403).send({ 
         success: false, 
         message: 'No token provided.' 
     });
 
    } 
});

app.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

require('./app/routes/user.routes')(app);
require('./app/routes/auth.routes')(app);

/*var userRoute = require('./app/models/user/userRoutes');
app.use('/api/users', userRoute);

var loginRoute = require('./app/models/login/auth');
app.use('/api/authenticate', loginRoute);*/

app.listen(port);
console.log('Magic happens at http://localhost:' + port);