const { User } = require("../models/User");


let auth = (req, res, next) => {
    // 인증 처리를 하는 곳

    // 1. 클라이언트 쿠키에서 토큰을 가져오기 
    let token = req.cookies.x_auth;
    
    // 2. 토큰을 복호화 한후 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err; // 4. 유저가 없으면 인증 NO!
        if(!user) return res.json({isAuth: false, error: true}) // 쿨러아언트에 유저 없으니까 처신하라는 것
        
        req.token = token; // 토큰이 있다면 토큰을 유저가 있다면 유저 정보를 넣어줌 , // 3. 유저가 있으면 인증 Okay
        req.user = user;
        next(); // next를 넣는 이유는 index.js의 미들웨어에게 계속 갈 수 있게 해주는 것
    })
    
    

    

}

module.exports = {auth};