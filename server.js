var express = require('express');
var cors = require('cors');
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));

var Users = require('./Routes/Users');
var Trucks = require('./Routes/Trucks');
var Quotes = require('./Routes/Quotes');
var Shared = require('./Routes/Shared');
var Tenders = require('./Routes/Tenders');

app.use('/users',Users);
app.use('/trucks',Trucks);
app.use('/quotes',Quotes);
app.use('/shared',Shared);
app.use('/tenders',Tenders);


app.listen(port,function(){
    console.log("Server is running on port: "+port);
});
