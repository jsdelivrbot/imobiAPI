const User = require('../models/user.model');
const jwt  = require('jsonwebtoken'); 

// Create and Save a new Note
exports.doAuth = (req, res) => {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ 
                success: false, 
                message: 'Authentication failed. User not found.' 
            });
        } else if (user) {
            if (user.password != req.body.password) {
                res.json({ 
                    success: false, 
                    message: 'Authentication failed. Wrong password.' 
                });
            } else {
                const payload = {
                    name: user.name 
                };
                var token = jwt.sign(payload, 'someSecretHere'/*app.get('secret')*/, {
                    expiresIn: 1440 // expires in 24 hours
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }   
        }
    });
};