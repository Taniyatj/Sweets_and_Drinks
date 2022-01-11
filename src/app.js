const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require ("bcrypt");

require("./db/conn");
const User = require("./models/registers");


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public"); 

const templates_path = path.join(__dirname, "../views"); 


app.use(express.json());
app.use(express.urlencoded({extended: false}));
 
app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set("views", templates_path);


app.get("/", (req, res) => {
  res.render("index")
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

app.listen(port, () => {
  console.log(`Server is running at Port ${port}.`);
}) 





