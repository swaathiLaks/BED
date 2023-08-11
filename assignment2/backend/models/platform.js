//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const insert = require('./myDefaultFn');
const platform = {
    insertplat: function(platform,callback){
        callback = insert([platform.platform_name, platform.description],"INSERT INTO platform (platformname, description) VALUES (?, ?);",true,callback)
        return callback;
    },

    getplat: function(callback){
        callback= insert([],"SELECT * FROM platform",false,callback)
        return callback;
    },

    getcat: function(callback){
        callback= insert([],"SELECT * FROM category",false,callback)
        return callback;
    },
}

module.exports = platform;