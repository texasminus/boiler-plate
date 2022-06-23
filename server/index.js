//Importing libraries
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { auth } = require('./middleware/auth') 
const { User } = require('./models/User') 
const config = require('./config/key.js')

const app = express()

//Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Database Connection
mongoose.connect(config.mongoURI)
.then(() => console.log("Database Connected..."))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/api/hello', cors(), (req, res) => {
  res.send("This is Axios!!!!")
});

//-------------Register-------------
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
});
//-------------Login-------------
app.post('/api/users/login', (req, res) => {
  //Check if the user exists.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      console.log("User Not Found.")
      return res.json({
        loginSuccess: false,
        message: "User Not Found."
      })
    }
    
    //Compare the password with the one in the database.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "Incorrect Password" })
      
      //If the password is correct, generate a token for the user.
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
        
        //Save the token in a cookie
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId : user._id})
      })
    })
  })
})

//-------------Auth--------------
app.get('/api/users/auth', auth, (req, res) => {
  //If the code has come here, it means that isAuth is true.
  res.status(200)
  .json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image
  })
})

//-------------Logout--------------
app.get('/api/users/logout', auth, (req, res) => {
  //Find a user with a token and delete the token.
  User.findOneAndUpdate({ _id: req.user._id }
    , {token: ""}
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      console.log("User Logged Out!")
      return res.status(200).send({
        success: true
      })
    })
  })
  
  //-------------PORT--------------
  const port = 3001;
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })