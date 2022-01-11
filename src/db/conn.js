const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Register", {
  useNewUrlParser:true,
}).then(() => {
  console.log(`Connection successful :)`);
}).catch((error) => {
  console.log(`No connection :(`);
})

