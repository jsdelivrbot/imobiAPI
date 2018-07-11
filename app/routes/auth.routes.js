module.exports = (app) => {
    const auth = require('../controllers/auth.controller');
    
    // Authenticate an user
    app.post('/authenticate', auth.doAuth);
}