const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 5
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  //Generate a token using JWT.
  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;
  //Decode a token
  jwt.verify(token, 'secretToken', function(err, decoded){
    //Find the user with the user._id.
    user.findOne({"_id": decoded, "token": token}, function(err, user){
      if(err) return cb(err)
      cb(null, user)
    })
    //Compare both tokens from the client and database.
  })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }