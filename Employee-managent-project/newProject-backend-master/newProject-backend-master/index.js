const express = require('express');
const app = express();
const mongoose = require('mongoose')
const config = require('./config')
const debug = require('./controllers/userController');
const bodyParser = require('body-parser')

const cors=require('cors');
const { cookie } = require('express/lib/response');

app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); 
    next();
  });


// app.use(cors());
app.use('/route',require('./controllers/userController'))

console.log('debug ======',debug);
mongoose.connect(config.DB_URI,{ useNewUrlParser: true , useUnifiedTopology: true });

mongoose.connection.on('error',function(err){
    console.log("Database connection Error");
    console.log(err);
});

mongoose.connection.on('open',function(){
  console.log("Database connection open success");
});


app.listen(5000,function(){
  console.log("App is listening on port 5000")
});
