const User = require('../models/user.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    var user = new User();
    user.name = req.body.name;
    user.password = req.body.password;

    user.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'User created!' });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    User.find(function(err, users) {
        if (err)
            res.send(err);

        res.json(users);
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    User.findById(req.params.userId, function(err, user) {
        if (err)
            res.send(err);

        user.name = req.body.name;
        user.password = req.body.password;
        
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User updated!' });
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    User.remove({_id: req.params.userId}, function(err, user) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
};