const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

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

// use morgan to log requests to the console
app.use(morgan('dev'));


var apiRoutes = express.Router(); 


// middleware to use for all requests
apiRoutes.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});
// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new User();      // create a new instance of the Bear model
        user.name = req.body.name;
        user.password = req.body.password;

        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
      User.find(function(err, users) {
          if (err)
              res.send(err);

          res.json(users);
      });
    });

apiRoutes.route('/users/:user_id')

  // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
  .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
          if (err)
              res.send(err);
          res.json(user);
      });
  })

  .put(function(req, res) {

    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {

        if (err)
            res.send(err);

        user.name = req.body.name;
        user.password = req.body.password;

        // save the user
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User updated!' });
        });

    });
  })

  // delete the user with this id (accessed at DELETE http://localhost:8080/api/users/:user_id)
  .delete(function(req, res) {
    User.remove({
        _id: req.params.user_id
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
  });

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// API ROUTES -------------------
// we'll get to these in a second

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);