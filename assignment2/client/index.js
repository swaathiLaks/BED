//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const express = require("express");
const app = express();
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/game/:id/:platform/", (req, res) => {
  res.sendFile("/public/viewgame.html", { root: __dirname });
});

app.get("/shoppingcart/", (req, res) => {
  res.sendFile("/public/shoppingcart.html", { root: __dirname });
});

app.get("/signup/", (req, res) => {
    res.sendFile("/public/signup.html", { root: __dirname });
  });

app.get("/login/", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/addgame/", (req, res) => {
    res.sendFile("/public/addgame.html", { root: __dirname });
});

app.get("/addplatform/", (req, res) => {
res.sendFile("/public/addplatform.html", { root: __dirname });
});

const PORT = 8082;
app.listen(PORT, () => {
  console.log(`Client server has started listening on port ${PORT}`);
});
