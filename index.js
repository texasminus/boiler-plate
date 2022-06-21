const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000

mongoose.connect("mongodb+srv://nws0078:Park8785^^@apal.oi4gf.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Database Connected..."))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})