const express = require("express");
const app = express();

const path = require("path");
const bcrypt = require ("bcrypt");
const fs = require("fs");

//Connect to DB 
require("./db/conn");
const User = require("./models/registers");
const Product = require("./models/products"); 

//Store Image on MongoDB
const multer = require("multer");
const storage = multer.diskStorage({
 destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });

//Hosting Website on Port  3000 or other
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at Port ${port}.`);
}) 

//Find path
const static_path = path.join(__dirname, "../public"); 
const templates_path = path.join(__dirname, "../views"); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(static_path));
app.set("view engine", 'hbs');
app.set("views", templates_path);

//GET hbs-pages
app.get("/", (req, res) => {
  res.render("index.hbs")
});
app.get("/products", (req, res) => {
  res.render("products");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/logout", (req, res) => {
  try {
  console.log("Logout successful!");
    res.render("login");
  } catch (error) {
    res.status(500).send (error);
  }
}); 

//POST Data
app.post("/products", upload.single('productimg'), (req, res, next) => {
  const obj = {
    productn: req.body.productn,
    anzahl: req.body.anzahl,
    pdescr: req.body.pdescr,
    productimg: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image'
    }   
  }
 Product.create(obj, (err, item) => {
    if (err) {
    console.log(err);
    }
  else {
    res.redirect('/views/index');
    }
 });
});
app.post("/register", async (req, res) => {
  try {

    const password = req.body.psw;
    const cpassword = req.body.cpsw;
    
    if(password === cpassword){

      const registerUser = new User({
        userN : req.body.userN,  
        adrs1 : req.body.adrs1,
        adrs2 : req.body.adrs2,
        eml : req.body.eml,
        psw : req.body.psw,
        cpsw : req.body.cpsw
      })
 

      const registered = await registerUser.save();
      res.status(201).render("index");

    }else{
      res.send("Passwörter sind nicht identisch!");
    }
   /*  console.log(req.body.userN);
    res.send(req.body.userN); */

  } catch(error) {
    res.status(400).send(error);
  }
});

//Login-Überprüfung

app.post("/login", async(req, res) => {
  try {
    
    const userName = req.body.userN;
    const password = req.body.psw;
  
  const username = await User.findOne({userN:userName});

  const isMatch = await bcrypt.compare(password, username.psw);   

  if(isMatch){
    res.status(201).render("index");
  }else{
    res.send("Entweder der Name oder das Passwort stimmt nicht."); 
  }

  } catch (error) {
    res.status(400).send("Entweder der Name oder das Passwort stimmt nicht.")
  }
}); 


