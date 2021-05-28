const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({

    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        token: {
            type: String
        },
        tokenExp: {
            type: Number
        }
    },
})

userSchema.pre('save', function( next ){ // Userjs 동기화 순서 2
    var user = this; // 위에 모델을 가르킴
   
    if(user.isModified('password')){ // 비밀번호가 수정될때만 작동하도록 if문 구동 
        bcrypt.genSalt(saltRounds, function(err, salt) { // 비밀번호를 암호화 하는것 
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
              if(err) return next(err)
              user.password = hash
              next()
            })  
          })
    } else { // 비번을 바꾸는게 아니라 다른 것을 바꿀상황을 생각하여 else를 추가함 
        next()
    }
  
}) // 유저 정보를 저장하기 전에 기능을 준다.

userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword 1234788 암호화된 비밀번호 ~~~~ 같은지 확인 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })

}

userSchema.methods.generateToken = function(cb){
    
    var user = this;
    //jsonwebtoken을 이용해서 token을 생성 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){ // 유저 정보를 인덱스로 넘겨줌 
        if(err) return cb(err)
        cb(null, user)
    })

}

const User = mongoose.model('User', userSchema)

module.exports = {User}
