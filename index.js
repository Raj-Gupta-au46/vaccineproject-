const express = require('express')
const app = express()
const  mongoose  = require('mongoose')

const route = require('../vaccineproject-/src/routers/route')


app.use(express.json())
mongoose.set('strictQuery', true)

mongoose.connect('mongodb+srv://rajgupta07082000:0Um5TBcHGam3DxeZ@cluster0.p92r9bx.mongodb.net/vacine-project', { useNewUrlParser : true })
.then( () => console.log("MongoDB is connected"))
.catch( (err) => console.log(err.message))

app.use('/', route)

app.listen(3000, function(){
    console.log("Express app is running on port 3000")
})