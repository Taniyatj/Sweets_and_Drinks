const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://webshop:webshop@cluster0.ce3vq.mongodb.net/Register", {
  useNewUrlParser:true,
}).then(() => {
  console.log(`Connection successful :)`);
}).catch((error) => {
  console.log(`No connection :(`);
})