var jwt    = require('jsonwebtoken');
// middleware to use for all requests

exports.verifyToken = (req, res, next) => {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    //next(); // make sure we go to the next routes and don't stop here

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
};