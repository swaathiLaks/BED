//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const insert = require('./myDefaultFn');
const game ={
    insertgame: function(game, game_file, callback){
        var game_cat = game.categoryid.split(',');
        var game_plat = game.platformid.split(',');
        var game_price = game.price.split(',');

        if (game_plat.length != game_price.length){
            return callback("Platform and price lengths are not equal", null);
        }
        if (!(game_file.originalname.endsWith('jpg'))||game_file.size>(1024**2)){
            return callback("Image is either not jpg or more than 1mb", null)
        }

        for (i=0; i<game_cat.length; i++){
            try{
                game_cat[i] = parseInt(game_cat[i]);
            }catch(error){
                return callback(error,null)
            }  
        }

        for (i=0 ; i<game_plat.length; i++){
            try{
                game_plat[i] = parseInt(game_plat[i]);
                game_price[i] = parseFloat(game_price[i]);
            }catch(error){
                return callback(error,null)
            }  
        }

        insert([game.title, game.description, game.year, game_file.buffer],"INSERT INTO game (title, description, year, image) VALUES (?, ?, ?, ?);",true, function (error, results){
            if (error){
                return callback(error, null);
            }  
            for (i of game_cat){
                insert([i, results],"INSERT INTO game_associative (categoryid, gameid) VALUES (?,?)",true,function (error, results1){
                    if (error){
                        return callback(error, null);
                    }
                })
            }
            for (i = 0; i < game_plat.length; i++){
                insert([game_plat[i], results, game_price[i]],"INSERT INTO platform_associative (platformid, gameid, price) VALUES (?,?,?)",true,function (error, results2){
                    if (error){
                        return callback(error, null);
                    }
                })
            }

            return callback(null,results);
        })       
    },

    getallgame: function(callback){
      callback= insert([],`SELECT
      g.gameid, g.title, g.description, pa.price, p.platformname AS platform,GROUP_CONCAT(ga.categoryid ORDER BY ga.categoryid) AS catid, GROUP_CONCAT(c.catname ORDER BY ga.categoryid) AS catname, g.year, g.created_at, g.image
      FROM 
      game g JOIN platform_associative pa ON g.gameid = pa.gameid JOIN platform p ON pa.platformid = p.platformid JOIN game_associative ga ON g.gameid = ga.gameid JOIN category c ON ga.categoryid = c.categoryid 
      GROUP BY 
      g.gameid, g.title, g.description, p.platformname, g.year, g.created_at;
    `,false,callback)
        return callback;
    },

    getgamebyid: function(gid,platform,callback){
      callback= insert([gid,platform],`SELECT
      g.gameid, g.title, g.description, pa.price, p.platformname AS platform,GROUP_CONCAT(ga.categoryid ORDER BY ga.categoryid) AS catid, GROUP_CONCAT(c.catname ORDER BY ga.categoryid) AS catname, g.year, g.created_at, g.image
      FROM 
      game g JOIN platform_associative pa ON g.gameid = pa.gameid JOIN platform p ON pa.platformid = p.platformid JOIN game_associative ga ON g.gameid = ga.gameid JOIN category c ON ga.categoryid = c.categoryid 
      WHERE g.gameid = ? AND p.platformname = ?
      GROUP BY 
      g.gameid, g.title, g.description, p.platformname, g.year, g.created_at;
    `,false,callback)
        return callback;
    },
}

module.exports = game;