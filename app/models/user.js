// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const Schema= mongoose.Schema;
// define the schema for our user model
var UserSchema = mongoose.Schema({
    name: String,

    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    polls: [{type: Schema.Types.ObjectId, ref:'poll'}]


});

// checking if password is valid using bcrypt
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the users password
UserSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};

UserSchema.pre('remove', function(next){
  const Poll=mongoose.model('poll');
  Poll.remove({_id: {$in: this.polls}})
  .then(()=>next());

})

const User=mongoose.model('user', UserSchema);
module.exports=User
