const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const config = require('./config/key')

const {User} = require('./models/User') 

mongoose.connect(config.mongoURI)
  .then(() => console.log("Database Connected..."))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})