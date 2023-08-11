//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const insert = require('./myDefaultFn');
const review = {
    insertrev: function(review, uid, gid, callback){
        insert([uid],"SELECT * FROM users WHERE userid = ?", false,function (error, results){
            if (error){
                return callback(error, null);
            }
            if (results.length==0){
                return callback("User does not exist.", null);
            }
            insert([gid],"SELECT * FROM game WHERE gameid = ?", false,function (error, results1){
                if (error){
                    return callback(error, null);
                }
                if (results1.length==0){
                    return callback("Game does not exist.", null);
                }
                callback = insert([uid,gid,review.content, review.rating],"INSERT INTO review (userid, gameid, content, rating) VALUES (?,?,?,?)",true,callback)
                return callback;
            })     
        })   
    },

    getreview: function(gid,callback){
        callback= insert([gid],"SELECT r.gameid, r.content, r.rating, u.username, r.created_at, r.userid, r.reviewid FROM users u JOIN review r ON u.userid = r.userid WHERE r.gameid = ?",false,callback)
        return callback;
    },

    putreview: function(review,callback){
        callback= insert([review.content, review.rating,review.reviewid],"UPDATE review SET content = ?, rating = ? WHERE reviewid = ?;",false,callback)
        return callback;
    },

    delreview: function(rid,callback){
        callback= insert([rid],"DELETE FROM review WHERE reviewid = ?;",false,callback)
        return callback;
    }
}

module.exports = review;