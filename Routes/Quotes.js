var express = require('express');
var quotes = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;
var postmark = require("postmark");
var client = new postmark.Client("8bd720e9-3d82-4df9-9c21-410e1a597595");
const moment = require('moment')

quotes.use(cors());

process.env.SECRET_KEY = "christo";
qId: number = 0;
getId: boolean = false;
quotes.post('/newQuote', function(req, res) {

    var appData = {
        "error": 1,
        "data": ""
    };
    var quoteData = {
        "description": req.body.description,
        "date": req.body.date,
    }

    var itemsToSave = [];
                 req.body.items.forEach(element => {
                 itemsToSave.push("("  +element.id + "," +element.amount + ",LAST_INSERT_ID()" + ")" )
                 });


                 var queryString = "INSERT INTO quotes (description, date) VALUES('"+quoteData.description+"','"+quoteData.date+"'); INSERT INTO `quoteItems` (itemId, amount, quoteId) VALUES " + [itemsToSave] 


    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            
            connection.query(queryString, function(err, res , rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Item added successfully!";
                    //res.status(201).json(appData);
                } else {
                    appData["data"] = "Error Occured!";
                   // res.status(400).json(appData);
                }
            });
            
            connection.release();

        }
    });

});

quotes.put('/editQuote', function(req, res) {
    var appData = {
        "error": 1,
        "data": ""
    };
    var quoteData = {
        "description": req.body.description,
        "date": req.body.date,
    }

    var itemsToSave = [];
    req.body.items.forEach(element => {
    itemsToSave.push("("  +element.id + "," +element.amount + "," + req.body.id + ")" )
    });

    sqlQuery = "UPDATE quotes SET description = " + "'" + quoteData.description + "'"  + ", date = " + "'"  + quoteData.date  + "'" + " WHERE id = " + req.body.id + " ;" + "DELETE FROM quoteItems WHERE quoteId = " + req.body.id + "; INSERT INTO `quoteItems` (itemId, amount, quoteId) VALUES " + [itemsToSave]

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(sqlQuery, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Item updated successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});


quotes.put('/sendToCustomer', function(req, res) {
    var appData = {
        "error": 1,
        "data": ""
    };
    var dateTime = new Date(req.body.date);
    dateTime = moment(dateTime).format("YYYY-MM-DD");
    var quoteData = {
        "description": req.body.description,
        "date": dateTime,
    }

    var itemsToSave = [];
    req.body.items.forEach(element => {
        var item = {"description": element.description,
        "amount": element.amount,}
    itemsToSave.push(item)
    });


    var template = {
        "total": req.body.total,
        "purchase_date": quoteData.date,
        "product_name": "Christo's shop",
        "name": req.body.email,
        "action_url": "action_url_Value",
        "invoice_id": req.body.id,
        "date": quoteData.date,
        "invoice_details": itemsToSave,
        "company_name": "Christo se company",
	    "company_addres": "6 Andrew Klerksdorp",
        }


    client.sendEmailWithTemplate({
        "From": "info@dankospark.co.za", 
        "TemplateId": 8650822,
        "To": req.query.email, 
        "TemplateModel": template
    });

    
});

quotes.use(function(req, res, next) {
    var token = req.headers.authorization;
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please send a token";
        res.status(403).json(appData);
    }
});

quotes.get('/getQuotes', function(req, res) {

    var appData = {};
    var queryString = "SELECT *FROM quotes ORDER BY " + "id DESC" ;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData = rows;
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});


quotes.put('/editItem', function(req, res) {
    var appData = {
        "error": 1,
        "data": ""
    };
    var itemData = {
        "description": req.body.description,
        "price": req.body.price,
        
    }

    sqlQuery = "UPDATE items SET description = " + "'" + itemData.description + "'"  + ", price = " + "'"  + itemData.price  + "'" + " WHERE id = " + req.body.id;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(sqlQuery, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Item updated successfully!";
                    res.status(201).json(appData);
                } else {
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                }
            });
            connection.release();
        }
    });
});


quotes.delete('/deleteQuote:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "DELETE FROM quotes WHERE id = " + id;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData = rows[0];
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});





quotes.get('/getQuote:id', function(req, res) {

    

    var quote = {
        "description": 0,
        "date": "",
        "items": [],

    }




    //const query = "SELECT quotes.id, quotes.description, quotes.date , quoteItems.quoteId, quoteItems.itemId,quoteItems.amount, items.description, items.price FROM quotes INNER JOIN quoteItems ON quotes.id=quoteItems.quoteId INNER JOIN items ON quoteItems.itemId=items.id WHERE quotes.id = " + req.id


    var appData = {};
    var id = +req.params.id;
    const queryString = "SELECT quotes.id, quotes.description AS qDescription, quotes.date , quoteItems.quoteId, quoteItems.itemId,quoteItems.amount, items.description, items.price FROM quotes INNER JOIN quoteItems ON quotes.id=quoteItems.quoteId INNER JOIN items ON quoteItems.itemId=items.id WHERE quotes.id = " + id;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (!err) {
                    //appData["error"] = 0;
                    quote.id = rows[0].id;
                    quote.description = rows[0].qDescription;
                    quote.date = rows[0].date;
                    rows.forEach(element => {
                        quote.items.push({id: element.itemId, description: element.description, amount: element.amount, price: element.price});
                    });
                    res.status(200).json(quote);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});





module.exports = quotes;