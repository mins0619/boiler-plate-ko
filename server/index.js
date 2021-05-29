
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // express 제공 기능 
const config = require('./config/key');
const {User} = require("./models/User");
const {auth} = require("./middleware/auth");


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.connect(config.mongoURl, {
useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("mongoDB is Connected.."))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 이러면~~~~~~~~~~?')
})

app.get('/api/hello', (req, res) => { // ∇2 . 클라이언트에서 요청한 정보를 받아옴
  
  // ∇3 할일들을 처리함 
  res.send("안녕하세요~~~") //∇4. 다시 프론트로 전달
})


app.post('/api/users/register', (req, res) => {

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

app.post('/api/users/login', (req, res)=> { 
  // 데이터 베이스에서 요청된 email 찾기
  User.findOne({ email: req.body.email }, (err,user) => { // 유저 이메일을 요구 but 만약 없다면 오류 출력 
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다. "
      })
    }
  
    // 요청된 email이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err,isMatch) => {
      if(!isMatch)  // 만약 ismatch가 없다면 ( 비밀번호 틀린 것 )
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다. " })
      
      // 비밀번호까지 맞다면 유저를 위한 토큰을 생성
      // 비밀번호가 같다면 토큰을 생성해줌 , jsonwebtoken 라이브러리를 다운
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err);

        
        // 토큰을 쿠키 or 로컬스터리지 등에 저장한다. 지금은 쿠키!
        res.cookie("x_auth", user.token) 
        .status(200) // 성공했다는 표시
        .json({ loginSuccess: true, UserId: user._id }) // 유저 아이디를 보내줌        


      })
    })
  }) 
})

app.get('/api/users/auth', auth ,(req,res) => { // 미드웨어는 엔트포인트에서 req를 받고 cb 하기 전에 중간에서 무언가를 하는 애

    // role 1 어드민 role 2 특정부서 어드민
    // role 0  일반유저 , 0이 아니면 관리자 
    // 여기까지 미들웨어를 통과해 왓다는 이야기는 authentication이 ture 라는 말.
    res.status(200).json ({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    })


})

app.get('/api/users/logout', auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

const port = 5000
app.listen(port, () => console.log(`hello ${port}!`))

