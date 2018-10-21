var express = require('express');
var tenders = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

tenders.use(cors());

process.env.SECRET_KEY = "christo";




tenders.use(function(req, res, next) {
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

tenders.post('/newTender', function(req, res) {

    var appData = {
        "error": 1,
        "data": ""
    };
    var tenderData = {
        "description": req.body.description,
        "start": req.body.start,
        "destination": req.body.destination,
        "startDate": req.body.startDate,
        "expiryDate": req.body.expiryDate,
        "companyId": req.body.companyId,
    }


    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO tenders SET ?', tenderData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Tender added successfully!";
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


tenders.get('/getTendersAll', function(req, res) {

    var appData = {};
    var queryString = "SELECT tenders.id, tenders.description, tenders.start, tenders.destination, tenders.startDate, tenders.expiryDate, company.name FROM tenders INNER JOIN company on tenders.companyId=company.id;"
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


tenders.get('/getMyTenders', function(req, res) {

    var appData = {};
    var queryString = "SELECT tenders.id, tenders.description, tenders.start, tenders.destination, tenders.startDate, tenders.expiryDate FROM tenders WHERE tenders.companyId = " + req.query.companyId
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



tenders.put('/editTender', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var tenderData = {
        "description": req.body.description,
        "start": req.body.start,
        "destination": req.body.destination,
        "startDate": req.body.startDate,
        "expiryDate": req.body.expiryDate,
    }

    sqlQuery = "UPDATE tenders SET description = " + "'" + tenderData.description + "'"  + ", start = " + "'"  + tenderData.start + "'"  +",  destination = " + "'"  + tenderData.destination + "'"  +",  startDate = " + "'"  + tenderData.startDate + "'"  +",  expiryDate = " + "'"  + tenderData.expiryDate + "'"  + " WHERE id = " + req.body.id;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(sqlQuery, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Tender updated successfully!";
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


tenders.delete('/deleteUser:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "DELETE FROM users WHERE id = " + id;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.statu5s(500).json(appData);
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


//const queryString = "SELECT tenders.id, tenders.description, tenders.start, tenders.destination, tenders.startDate, tenders.expiryDate FROM tenders WHERE tenders.id = " + id;


tenders.get('/getTender:id', function(req, res) {

    var appData = {};
    const queryString = "SELECT * FROM tenders WHERE tenders.id = " + req.params.id;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.statu5s(500).json(appData);
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





module.exports = tenders;