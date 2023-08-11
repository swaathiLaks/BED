//Swaathi Lakshmanan
//P2227171
//DISM/FT/2B/21
const db = require("./databaseConfig");

function insert(arglist, insertQuery, justid,callback)  {
    var dbConn = db.getConnection();
    dbConn.connect(function (err) {
        if (err) {
        console.log(err);
        return callback(err, null);
        } else {
        dbConn.query(
            insertQuery,
            arglist,
            (error, results) => {
            dbConn.end();
            if (error) {
                return callback(error, null);            
            };
            if (justid){
                return callback(null, results.insertId);
            }else{
                return callback(null, results);
            }
            });
        }
    });
    }

const spg = {

    //specific post code

    //DONE
    insertuser: function(user,callback){ 
        callback = insert([user.username, user.email, user.password, user.type, user.profile_pic_url],"INSERT INTO users (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?);",true,callback)
        return callback;
    },

    //DONE
    insertcat: function(category,callback){
        callback = insert([category.catname, category.description],"INSERT INTO category (catname, description) VALUES (?, ?);",true,callback)
        return callback;
    },

    //DONE
    insertplat: function(platform,callback){ 
        callback = insert([platform.platform_name, platform.description],"INSERT INTO platform (platformname, description) VALUES (?, ?);",true,callback)
        return callback;
    },

    //DONE
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

    //DONE
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

    //DONE
    getusers: function(callback){
        callback= insert([],"SELECT * FROM users",false,callback)
        return callback;
    },

    //DONE
    getuserbyid: function(uid,callback){
        callback= insert([uid],"SELECT * FROM users WHERE userid = ?",false,callback)
        return callback;
    },

    //DONE
    getgamebyplat: function(platform,callback){
        callback= insert([platform],`SELECT
        g.gameid, g.title, g.description, pa.price, p.platformname AS platform,GROUP_CONCAT(ga.categoryid ORDER BY ga.categoryid) AS catid, GROUP_CONCAT(c.catname ORDER BY ga.categoryid) AS catname, g.year, g.created_at 
        FROM 
        game g JOIN platform_associative pa ON g.gameid = pa.gameid JOIN platform p ON pa.platformid = p.platformid JOIN game_associative ga ON g.gameid = ga.gameid JOIN category c ON ga.categoryid = c.categoryid 
        WHERE p.platformname = ? 
        GROUP BY 
        g.gameid, g.title, g.description, p.platformname, g.year, g.created_at;
    `,false,callback)
        return callback;
    },

    //DONE
    getgamewithimage: function(platform,callback){
        callback= insert([platform],`SELECT
        g.gameid, g.title, g.description, pa.price, p.platformname AS platform,GROUP_CONCAT(ga.categoryid ORDER BY ga.categoryid) AS catid, GROUP_CONCAT(c.catname ORDER BY ga.categoryid) AS catname, g.year, g.created_at, g.image
        FROM 
        game g JOIN platform_associative pa ON g.gameid = pa.gameid JOIN platform p ON pa.platformid = p.platformid JOIN game_associative ga ON g.gameid = ga.gameid JOIN category c ON ga.categoryid = c.categoryid 
        WHERE p.platformname = ? 
        GROUP BY 
        g.gameid, g.title, g.description, p.platformname, g.year, g.created_at;
    `,false,callback)
        return callback;
    },

    //DONE
    getreview: function(gid,callback){
        callback= insert([gid],"SELECT r.gameid, r.content, r.rating, u.username, r.created_at FROM users u JOIN review r ON u.userid = r.userid WHERE r.gameid = ?",false,callback)
        return callback;
    },
    //DONE
    deletegame: function(gid,callback){
        callback= insert([gid],"DELETE FROM game WHERE gameid = ?;",false,callback)
        return callback;
    },
    //DONE
    updategame: function (gid, game, game_file, callback) {
        const async = require("async");
        var game_cat = game.categoryid.split(",");
        var game_plat = game.platformid.split(",");
        var game_price = game.price.split(",");
        var liresults = [];
      
        if (game_plat.length != game_price.length) {
          return callback("Platform and price lengths are not equal", null);
        }
        if (
          !game_file.originalname.endsWith("jpg") ||
          game_file.size > 1024 ** 2
        ) {
          return callback("Image is either not jpg or more than 1mb", null);
        }
      
        for (i = 0; i < game_cat.length; i++) {
          try {
            game_cat[i] = parseInt(game_cat[i]);
          } catch (error) {
            liresults.push(error);;
            return;
          }
        }
      
        for (i = 0; i < game_plat.length; i++) {
          try {
            game_plat[i] = parseInt(game_plat[i]);
            game_price[i] = parseFloat(game_price[i]);
          } catch (error) {
            liresults.push(error);;
            return;
          }
        }
      
        async.series(
          [
            // First series function: delete from game_associative
            function (seriesCallback) {
              insert(
                [gid],
                "DELETE FROM game_associative WHERE gameid = ?;",
                true,
                function (error, results) {
                  if (error) {
                    liresults.push(error);
                  }
                  seriesCallback(error);
                }
              );
            },
            // Second series function: delete from platform_associative
            function (seriesCallback) {
              insert(
                [gid],
                "DELETE FROM platform_associative WHERE gameid = ?;",
                true,
                function (error, results) {
                  if (error) {
                    liresults.push(error);;
                  }
                  seriesCallback(error);
                }
              );
            },
            // Third series function: update game
            function (seriesCallback) {
              insert(
                [game.title, game.description, game.year, game_file.buffer, gid],
                "UPDATE game SET title = ?, description = ?, year = ?, image = ? WHERE gameid = ?;",
                true,
                function (error, results) {
                  if (error) {
                    liresults.push(error);;
                    seriesCallback(error);
                    return;
                  }
                  async.eachSeries(
                    game_cat,
                    function (cat, eachSeriesCallback) {
                      insert(
                        [cat, gid],
                        "INSERT INTO game_associative (categoryid, gameid) VALUES (?,?)",
                        true,
                        function (error, results1) {
                          if (error) {
                            liresults.push(error);;
                          }
                          eachSeriesCallback(error);
                        }
                      );
                    },
                    function (error) {
                      if (error) {
                        seriesCallback(error);
                        return;
                      }
                      async.eachOfSeries(
                        game_plat,
                        function (plat, index, eachOfSeriesCallback) {
                          insert(
                            [plat, gid, game_price[index]],
                            "INSERT INTO platform_associative (platformid, gameid, price) VALUES (?,?,?)",
                            true,
                            function (error, results2) {
                              if (error) {
                                liresults.push(error);
                              }
                              eachOfSeriesCallback(error);
                            }
                          );
                        },
                        function (error) {
                          seriesCallback(error);
                        }
                      );
                    }
                  );
                }
              );
            },
          ],
          // Final callback
          function (error) {
            if (liresults.length == 0) {
              return callback(null, null);
            } else {
              return callback(error, null);
            }
          }
        );
      },
      
      //DONE
    getgameids: function(callback){
        callback= insert([],"SELECT gameid FROM game;",false,callback)
        return callback;
    },
    //DONE
    getgamebyid: function(gid,callback){
        callback= insert([gid],"SELECT g.gameid, g.title, g.description,  g.year, g.created_at FROM game g WHERE gameid = ?;",false,callback)
        return callback;
    },

}

module.exports = spg;