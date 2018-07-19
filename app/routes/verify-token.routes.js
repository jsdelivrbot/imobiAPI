module.exports = (app) => {
    const token = require('../controllers/verify-token.controller');
    
    // Verify token
    app.use('/', token.verifyToken);
}