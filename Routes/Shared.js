var express = require('express');
var shared = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

shared.use(cors());

process.env.SECRET_KEY = "christo";

shared.post('/newTruck', function(req, res) {

    var appData = {
        "error": 1,
        "data": ""
    };
    var itemData = {
        "description": req.body.description,
        "price": req.body.price,
    }

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO items SET ?', itemData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Item added successfully!";
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


shared.use(function(req, res, next) {
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

shared.get('/getTruckTypes', function(req, res) {

    var appData = {};
    var queryString = "SELECT * FROM truckType ORDER BY " + "description" ;
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
//    var queryString = "SELECT users.id, users.name, users.email, users.cellNumber, roles.value AS role FROM users INNER JOIN roles on users.roleId=roles.id WHERE companyId = " +req.query.companyId ;

shared.get('/getFriends', function(req, res) {

    var appData = {};
    var queryString = "SELECT friends.companyId2, company.name, users.email, users.cellNumber FROM friends INNER JOIN company on friends.companyId2 = company.id INNER JOIN users on company.id = users.companyId WHERE friends.companyId1 = "+req.query.companyId+" AND users.roleId = 1"
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.statu5s(500).json(appData);
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


shared.post('/addFriend', function(req, res) {

    var appData = {};
    var email = req.body.email;
    var password = req.body.password;
    const queryString1 = "SELECT * FROM company WHERE companyCode = " + req.body.companyCode;

    const queryString = "START TRANSACTION; SELECT company.id AS ID FROM company WHERE company.companyCode = '"+req.body.companyCode+ "'; INSERT INTO friends (id, companyId1, companyId2) SELECT companyCode,"+ req.body.companyId + ", ID FROM company WHERE companyCode = '"+req.body.companyCode+ "'; INSERT INTO friends (id, companyId1, companyId2) SELECT companyCode, ID,"+ req.body.companyId +" FROM company WHERE companyCode = '"+req.body.companyCode+ "'; COMMIT;";

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    if (rows.length > 0) {
                        res.status(204).json(appData);
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json(appData);
                    }
                }
            });
            connection.release();
        }
    });
});


shared.put('/editItem', function(req, res) {
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


shared.delete('/deleteItem:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "DELETE FROM items WHERE id = " + id;
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





shared.get('/getItem:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "SELECT * FROM items WHERE id = " + id;
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





module.exports = shared;