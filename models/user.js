
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const emailValidator = [{
    validator: function(email){
        if(!email) return false;
        else{
            if(email.legth > 30 || email.legth < 5) return false;
            let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            return regexp.test(email);
        }
    },
    message: "Invalid email"
}];

const usernameValidator = [{
    validator: function(username){
        if(!username) return false;
        else{
            if(username.legth > 15) return false;
            let regexp = new RegExp(/^[a-zA-Z0-9]+$/);
            console.log(regexp.test(username));
            return regexp.test(username);
        }
    },
    message: "Username must contain only letters and numbers. No more than 15 characters"
}];

const passwordValidator = [{
    validator: function(password){
        if(!password) return false;
        else{
            if(password.legth < 6 || password.legth > 12) return false;
            let regexp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{6,12}$/);
            console.log(regexp.test(password));
            return regexp.test(password);
        }
    },
    message: "Password must contain at least one letter and one number. between 6 and 12 characters"
}];

const userSchema = new Schema({
    email : {type: String, required: true, unique: true, lowercase: true, validate: emailValidator},
    username : {type: String, required: true, unique: true, lowercase: true, validate: usernameValidator},
    password : {type: String, required: true, validate: passwordValidator}
});

userSchema.pre('save', function(next){
    if (!this.isModified('password'))
        return next;
    bcrypt.hash(this.password, null, null, (err,hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePasswords = (password) => {
    return bcrypt.compareSync(password. this.password);
};

module.exports = mongoose.model('User', userSchema);