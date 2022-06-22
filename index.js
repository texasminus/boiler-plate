const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const { User } = require('./models/User') 
const config = require('./config/key.js')

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


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