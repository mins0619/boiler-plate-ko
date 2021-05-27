const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

const config = require('./config/key')
const {User} = require("./models/User");


app.use(bodyParser.urlencoded({extended: true})); // 에플리케이션에서 회원가입 정보를 불러오는 역할 
app.use(bodyParser.json());


const mongoose = require("mongoose");
const { json } = require('body-parser');
mongoose.connect(config.mongoURl, {
useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("mongoDB is Connected.."))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 이러면~~~~~~~~~~?')
})

app.post('/register', (req, res) => {

// 회원가입시 필요한 정보들을 client 에서 가져오면
// 그것을 데이터 베이스에 보내준다. 

    const user = new User(req.body) // Userjs 동기화 순서 1
      //User.js 이동  동기화 순서 2 
    user.save((err, userInfo) => { //Userjs 동기화 순서 3
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})