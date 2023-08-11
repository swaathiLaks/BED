//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const insert = require('./myDefaultFn');

const shopping = {
    insertcart: function(shopping,callback){
        callback = insert([shopping.gameid, shopping.userid, shopping.address_line_1, shopping.address_line_2, shopping.country, shopping.postal, shopping.email_del, shopping.payment_method, shopping.card_number, shopping.card_name, shopping.card_expire, shopping.card_cvv, shopping.platform_id, shopping.city],"INSERT INTO shopping (gameid, userid, address_line_1, address_line_2, country, postal, email_del, payment_method, card_number, card_name, card_expire, card_cvv, platform, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",true,callback)
        return callback;
    },

    getcartbyid: function(uid,callback){
        callback= insert([uid],"SELECT gameid, platform, created_at FROM shopping WHERE userid = ?",false,callback)
        return callback;
    },
}

module.exports = shopping;