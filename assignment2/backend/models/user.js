const insert = require('./myDefaultFn');
//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
var jwt=require('jsonwebtoken');
var config=require('../config');

const user = {
    insertuser: function(user,callback){
        callback = insert([user.username, user.email, user.password, user.type, user.profile_pic_url],"INSERT INTO users (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?);",true,callback)
        return callback;
    },

    loginuser: function(username, password, callback){
        insert([username, password], "SELECT userid, type FROM users WHERE username=? and password=?", false, function(err, result){
            if (err || result.length==0){
                if (err==null){err="User doesnt exist"}
                return callback(err);
            }else{
                var token="";
                if(result.length==1){
                    token=jwt.sign({id:result[0].id,role:result[0].type},config.key,{
                        expiresIn:86400
                    });
                }
                return callback(null, result[0].userid, token);
            }
        })
    }
}

module.exports = user;