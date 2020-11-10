var express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

var app   = express();
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose
  .connect(
      "mongodb+srv://SAURABH:zzqP7ChJTqESP4lW@cluster0.06klg.mongodb.net/mean-stack-a?retryWrites=true&w=majority"     )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!:"+err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  console.log("inside server");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept ,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH,PUT, DELETE, OPTIONS"
  );
  next();
  //res.json("sending hello from server");
});

app.use("/api/posts/",postRoutes)
app.use("/api/users/",userRoutes)

module.exports=app;


