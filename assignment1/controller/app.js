//Swaathi Lakshmanan
//P2227171
//DISM/FT/2B/21
var express=require('express');
var app=express();
const multer = require('multer');
const upload = multer();
const spg = require("../model/spgames")
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(upload.single('image'));

app.post("/users/", (req, res, next) => {
    spg.insertuser(req.body, (error, userid) => {
        if (error != null && error.code == 'ER_DUP_ENTRY'){
            console.log(error)
            res.status(422).send({"Error":"Email or username provided already exists"});
            return;
        } else if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send({
            userid
        });
    });     
  });

app.post("/category/", (req, res, next) => {
    spg.insertcat(req.body, (error) => {
        if (error != null && error.code == 'ER_DUP_ENTRY'){
            console.log(error)
            res.status(422).send({"Error":"The category name provided already exists"});
            return;
        } else if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send();
    });     
});

app.post("/platform/", (req, res, next) => {
    spg.insertplat(req.body, (error) => {
        if (error != null && error.code == 'ER_DUP_ENTRY'){
            console.log(error)
            res.status(422).send({"Error":"The platform name provided already exists"});
            return;
        } else if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send();
    });     
});

app.post("/game/", (req, res, next) => {
    spg.insertgame(req.body, req.file, (error,gameid) => {
        if (error != null && error.code == 'ER_DUP_ENTRY'){
            console.log(error)
            res.status(422).send({"Error":"The game name provided already exists"});
            return;
        } else if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send({gameid});
    });     
});

app.post("/user/:uid/game/:gid/review/", (req, res, next) => {

    try{
        uid = parseInt(req.params.uid)
        gid = parseInt(req.params.gid)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    
    spg.insertrev(req.body, uid, gid, (error,reviewid) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send({reviewid});
    });     
});

app.get("/users/", (req, res, next) => {
    spg.getusers((error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(200).send(results);
    });     
});

app.get("/users/:id/", (req, res, next) => {
    try{
        id = parseInt(req.params.id)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    spg.getuserbyid(id,(error,results) => {
        if (error||results.length==0) {
            if (error!=null){
                console.log(error);
            }else{
                console.log("Invalid user id.")
            }
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(200).send(results);
    });     
});

app.get("/game/:platform/", (req, res, next) => {
    spg.getgamebyplat(req.params.platform,(error,results) => {
        if (error||results.length==0) {
            if (error!=null){
                console.log(error);
            }else{
                res.status(500).send({"Error":"No games exist in this platform."});
                return;
            }
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        
        res.status(200).send(results);
    });     
});

app.get("/game/image/:platform/", (req, res, next) => {
    spg.getgamewithimage(req.params.platform,(error,results) => {
        if (error||results.length==0) {
            if (error!=null){
                console.log(error);
            }else{
                res.status(500).send({"Error":"Invalid platform."});
                return;
            }
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        
        res.status(200);
        res.setHeader('Content-Type', 'text/html');
        res.write('<html><body>');
        for (i = 0; i<results.length; i++){
            const { gameid, title, description, price, platform, catid, catname, year, created_at } = results[i];
            const data = { gameid, title, description, price, platform, catid, catname, year, created_at };

            for (property in data){
                res.write('<p>'+property+" : "+data[property]+'</p>')
            }
            res.write('<img src="data:image/jpeg;base64,' + results[i].image.toString('base64') + '" width = "300">');
        }
        
        res.write('</body></html>');
        res.end();
        

    });     
});

app.get("/game/:id/review/", (req, res, next) => {
    try{
        id = parseInt(req.params.id)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    spg.getreview(id,(error,results) => {
        if (error) {
            if (error!=null){
                console.log(error);
            }
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        var total = 0
        for (i=0; i<results.length; i++){
            total+= parseInt(results[i].rating)
        }
        res.status(200).send({results,"Average Rating":(total/results.length).toFixed(2)});
    });     
});

app.delete("/game/:id/", (req, res, next) => {
    try{
        id = parseInt(req.params.id)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    spg.deletegame(id,(error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(204).send();
    });     
});

  
app.put("/game/:id/", async (req, res, next) => {
    var ifnull=true;
    try {
      const id = parseInt(req.params.id);
      await new Promise((resolve, reject) => {
        spg.updategame(id, req.body, req.file, (error, results) => {
          if (error) {
            console.log(error)
            ifnull = false
            reject(error);
            return;
          }
          resolve()
        });
      });
      console.log("ifnull: ", ifnull);

      if (ifnull) {
        res.status(204).send()
      }else{
        res.status(500).send({ "Error": "Unknown error" });
      }
        
    } catch (error) {
      res.status(500).send({ "Error": "Unknown error" });
    }
  });


app.get("/gamebypopularity/", async (req, res, next) => {
    try {
        const allratings = {};
        const results = await new Promise((resolve, reject) => {
            spg.getgameids((error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).send({ "Error": "Unknown error" });
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        for (let h = 0; h < results.length; h++) {
            const results2 = await new Promise((resolve, reject) => {
                spg.getreview(results[h].gameid, (error, results2) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ "Error": "Unknown error" });
                        reject(error);
                    } else {
                        resolve(results2);
                    }
                });
            });

            let total = 0;
            for (let i = 0; i < results2.length; i++) {
                total += parseInt(results2[i].rating);
            }
            if (total !== 0) {
                allratings[results[h].gameid] = total / results2.length;
            } else {
                allratings[results[h].gameid] = 0;
            }
        }

        const sorted = Object.keys(allratings).map((key) => [key, allratings[key]]);
        sorted.sort((first, second) => second[1]-first[1] );
        const indexes = sorted.map((e) => e[0]);

        var finalresults = [];
        for (let i = 0; i < indexes.length; i++) {
            const results3 = await new Promise((resolve, reject) => {
                spg.getgamebyid(indexes[i], (error, results3) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ "Error": "Unknown error" });
                        reject(error);
                    } else {
                        resolve(results3);
                    }
                });
            });

            finalresults.push({ [`Average rating of ${results3[0].title}`]: allratings[indexes[i]].toFixed(2) });
            finalresults.push({ [indexes[i]]: results3[0] });
        }
        res.status(200).send(finalresults);
    } catch (error) {
        console.log(error);
        res.status(500).send({ "Error": "Unknown error" });
    }
});

module.exports = app;
