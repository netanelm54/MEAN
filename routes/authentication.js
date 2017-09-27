const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {

        if (!req.body.email) res.json({ success: false, message: 'email is required' });
        else if (!req.body.username) res.json({ success: false, message: 'username is required' });
        else if (!req.body.password) res.json({ success: false, message: 'password is required' });
        else {
            console.log(req.body);

            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            });

            user.save((err) => {
                if (err) {
                    if (err.code === 11000) res.json({ success: false, message: 'Username or email already exists' });
                    else if (err.errors) {
                        if (err.errors.email) res.json({ success: false, message: err.errors.email.message });
                        else if (err.errors.username) res.json({ success: false, message: err.errors.username.message });
                        else if (err.errors.password) res.json({ success: false, message: err.errors.password.message });

                        else res.json({ success: false, message: 'Save faild', err });
                    }
                    else res.json({ success: false, message: 'Save faild', err });
                }
                else res.json({ success: true, message: 'User saved successfully', err });
            });
        }
    });


    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) res.json({ success: false, message: 'E-mail was not provided' });
        else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) res.json({ success: false, message: err }); // Return connection error
                else if (user) res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
                else res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
            });
        }
    });

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) res.json({ success: false, message: 'Username was not provided' }); // Return error
        else {
            User.findOne({ username: req.params.username }, (err, user) => {
                // Check if connection error was found
                if (err) res.json({ success: false, message: err }); // Return connection error
                else if (user) res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
                else res.json({ success: true, message: 'Username is available' }); // Return as vailable username
            });
        }
    });

    router.post('/login', (req, res) => {
        console.log(req);
        if (!req.body.username) res.json({ success: false, message: 'Please enter a username' });
        else if (!req.body.password) res.json({ success: false, message: 'Please enter a password' });
        else {
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                if (err) res.json({ success: false, message: err });
                else if (!user) res.json({ success: false, message: 'Username not found.' });
                else {
                    const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                    if (!validPassword) res.json({ success: false, message: 'Invalid password' });
                    else {
                        const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                        res.json({ success: true, message: 'Success', token: token, user: { username: user.username } }); // Return success and token to frontend
                    }
                }
            });
        }
    });


    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        if (!token) res.json({ success: false, message: 'No token provided' });
        else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) res.json({ success: false, message: 'Invalid token: ' + err });
                else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            // Check if error connecting
            if (err) res.json({ success: false, message: err });
            else if (!user) res.json({ success: false, message: 'User not found' });
            else res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        });
    });


    return router;
}