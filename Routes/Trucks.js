var express = require('express');
var trucks = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

trucks.use(cors());

process.env.SECRET_KEY = "christo";

trucks.post('/newTruck', function(req, res) {

    var appData = {
        "error": 1,
        "data": ""
    };
    var truckData = {
        "description": req.body.description,
        "truckTypeId": req.body.truckTypeId,
        "companyId": req.body.companyId,
    }

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO trucks SET ?', truckData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Truck added successfully!";
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


trucks.use(function(req, res, next) {
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

trucks.get('/getTrucks', function(req, res) {

    var appData = {};
    var queryString = "SELECT trucks.id, trucks.description, truckType.id AS truckTypeId, truckType.description AS truckTypeDescription FROM trucks INNER JOIN truckType ON trucks.truckTypeId=truckType.id WHERE trucks.companyId = " + req.query.companyId + " ORDER BY " + "description" ;
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




trucks.put('/editTruck', function(req, res) {
    var appData = {
        "error": 1,
        "data": ""
    };
    

    sqlQuery = "UPDATE trucks SET description = " + "'" + req.body.description + "'"  + ", truckTypeId = " + "'"  + req.body.truckTypeId + "'" + " WHERE id = " + req.body.id;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(sqlQuery, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "Truck updated successfully!";
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


trucks.delete('/deleteTruck:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "DELETE FROM trucks WHERE id = " + id;
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





trucks.get('/getTruck:id', function(req, res) {
    var truckType = {"id": 0, "description": ""}
    var truckData = {"id": 0,
                    "description": "",
                    "truckType": truckType,
                }
    var appData = {};
    var id = req.params.id;
    const queryString = "SELECT trucks.id, trucks.description, trucks.truckTypeId, truckType.description AS truckDescription FROM trucks INNER JOIN truckType ON trucks.truckTypeId = truckType.id WHERE trucks.id = " + id;
    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (!err) {
                    truckData.id = rows[0].id,
                    truckData.description = rows[0].description,
                    truckData.truckType = {id: rows[0].truckTypeId, description: rows[0].truckDescription} 

                    res.status(200).json(truckData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});





module.exports = trucks;