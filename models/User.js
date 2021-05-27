const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({

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

UserSchema.pre('save', function( next ){ // Userjs 동기화 순서 2
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
    }
  
}) // 유저 정보를 저장하기 전에 기능을 준다.

const User = mongoose.model('User', UserSchema)

module.exports = {User}
