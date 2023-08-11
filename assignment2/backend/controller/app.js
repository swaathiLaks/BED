//Swaathi Lakshmanan
//P2227171
//DISM/FT/2B/21
var express=require('express');
var app=express();

const platform = require("../models/platform");
const review = require("../models/review");
const game = require("../models/game");
const user = require("../models/user");
const shopping = require("../models/shopping");
const verify = require("../auth/verify");

const multer = require('multer');
const upload = multer();
var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
app.use(bodyParser.json());
app.use(urlencodedParser);
app.use(upload.single('image'));
const cors = require("cors");
app.use(cors());

app.post("/users/", (req, res, next) => {
    user.insertuser(req.body, (error, userid) => {
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

app.post("/platform/",verify.verifyToken, verify.verifyAdmin, (req, res, next) => {
    platform.insertplat(req.body, (error) => {
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

app.post("/game/",verify.verifyToken, verify.verifyAdmin, (req, res, next) => {
    game.insertgame(req.body, req.file, (error,gameid) => {
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

app.post("/shopping/", verify.verifyToken,(req, res, next) => {
    shopping.insertcart(req.body,(error,result) => {
        if (error != null){
            console.log(error)
            res.status(500).send({"Error":"Unknown error"});
            return;
        } 
        res.status(201).send();
    });     
});


app.get('/isadmin/', verify.verifyToken, verify.verifyAdmin, (req, res) => {
    res.status(200).send({ isAdmin: true });
});

app.get('/isuser/', verify.verifyToken, (req, res) => {
    res.status(200).send({ isUser: true });
});

app.post("/user/:uid/game/:gid/review/", verify.verifyToken, (req, res, next) => {

    try{
        uid = parseInt(req.params.uid)
        gid = parseInt(req.params.gid)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    
    review.insertrev(req.body, uid, gid, (error,reviewid) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(201).send({reviewid});
    });     
});

app.get("/shopping/:id/", (req, res, next) => {
    uid = parseInt(req.params.id)
    shopping.getcartbyid(uid,(error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(200).send(results);
    });     
});

app.get("/platforms/", (req, res, next) => {
    platform.getplat((error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(200).send(results);
    });     
});

app.get("/categories/", (req, res, next) => {
    platform.getcat((error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(200).send(results);
    });     
});


app.post("/login/", (req, res, next) => {
    var username=req.body.username;
    var password=req.body.password;
    user.loginuser(username, password, (error, userid, token) => {
        if(!error){
            res.send({user_id:userid, token:token});

        }else{
            console.log(error)
            res.status(500);
            res.send(error);
        }
    });     
});


app.post("/allgames/", (req, res, next) => {
    var platformstr = req.body.platform;
    var gamestr = req.body.gamestr;
    game.getallgame((error,results) => {
        if (error) {
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        var formattedResults = [];
        for (i = 0; i<results.length; i++){
            if ((results[i].title).toLowerCase().includes(gamestr.toLowerCase())&&(platformstr == "Any" || results[i].platform == platformstr)){
                var { gameid, title, description, price, platform, catid, catname, year, created_at } = results[i];
                var data = { gameid, title, description, price, platform, catid, catname, year, created_at };

                data.image = results[i].image.toString("base64");
                formattedResults.push(data);
            }
        }
        res.status(200).json(formattedResults);
    });     
});

app.get("/game/:id/:platform/", (req, res, next) => {
    var gid = parseInt(req.params.id);
    var platform = req.params.platform;
    game.getgamebyid(gid, platform,(error,results) => {
        if (error || results.length == 0) {
            console.log(error)
            res.status(500).send({"Error":"Unknown error"});
            return;
        }else{
            var formattedResults = [];
            for (i = 0; i<results.length; i++){
                var { gameid, title, description, price, platform, catid, catname, year, created_at } = results[0];
                var data = { gameid, title, description, price, platform, catid, catname, year, created_at };
                data.image = results[0].image.toString("base64");
                formattedResults.push(data);
            }
            res.status(200).json(formattedResults);
        };
    });     
});

app.put("/gamereview/", verify.verifyToken, (req, res, next) => {
    review.putreview(req.body,(error,results) => {
        if (error) {
            console.log(error)
            res.status(500).send({"Error":"Unknown error"});
            return;
        }else{res.status(204)}
    });     
});

app.delete("/gamereview/:id/",verify.verifyToken, (req, res, next) => {
    try{
        id = parseInt(req.params.id)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    review.delreview(id,(error,results) => {
        if (error) {
            console.log(error);
            res.status(500).send({"Error":"Unknown error"});
            return;
        };
        res.status(204).send();
    });     
});

app.get("/gamereview/:id/", (req, res, next) => {
    try{
        id = parseInt(req.params.id)
    }catch(error){
        res.status(400).send({"Error":"Invalid ID"});
    }
    review.getreview(id,(error,results) => {
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
        res.status(200).send({results,avgrating:(total/results.length).toFixed(2)});
    });     
});

module.exports = app;