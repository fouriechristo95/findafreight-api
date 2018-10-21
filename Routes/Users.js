var express = require('express');
var users = express.Router();
var database = require('../Database/database');
var cors = require('cors')
var jwt = require('jsonwebtoken');
var token;

users.use(cors());

process.env.SECRET_KEY = "christo";

users.post('/registerfirst', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = "('" +req.body.name+ "','" + req.body.email + "','"+ req.body.cellNumber + "','" + req.body.password + "','" + 1 + "',LAST_INSERT_ID());" 

    var companyData = {
        "name": req.body.companyName
    }
    var queryString = "START TRANSACTION; INSERT INTO company (name) VALUES('"+ companyData.name +"'); INSERT INTO `users` (name, email, cellNumber, password, roleId, companyId) VALUES " + userData + " COMMIT;"

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(queryString, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
                    res.status(201).json(appData);
                } else {
                    if (err.errno == 1062)
                    {
                        appData["data"] = "Email already exist!";
                        res.status(201).json(appData);
                    }
                    else
                    {
                        appData["data"] = "Error Occured!";
                        res.status(201).json(appData);
                    }
                    
                }
            });
            connection.release();
        }
    });
});

users.post('/login', function(req, res) {

    var appData = {};
    var email = req.body.email;
    var password = req.body.password;
    const queryString = "SELECT users.id, users.name, users.companyId, users.email, users.password, users.cellNumber, roles.value AS role FROM users INNER JOIN roles ON users.roleId=roles.id WHERE users.email = '" + email +"'";
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
                        if (rows[0].password == password) {
                            let token = jwt.sign(JSON.parse(JSON.stringify(rows[0])), process.env.SECRET_KEY, {

                                expiresIn: 50000
                                
                                });
                            appData.error = 0;
                            appData["token"] = token;
                            appData["role"] = rows[0].role;
                            appData["companyId"] = rows[0].companyId;
                            res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(204).json(appData);
                        }
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



users.use(function(req, res, next) {
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

users.post('/register', function(req, res) {

    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = {
        "name": req.body.name,
        "email": req.body.email,
        "cellNumber": req.body.cellNumber,
        "roleId": req.body.roleId,
        "password": req.body.password,
        "companyId": req.body.companyId,
    }


    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('INSERT INTO users SET ?', userData, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
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


users.get('/getUsers', function(req, res) {

    var appData = {};
    var queryString = "SELECT users.id, users.name, users.email, users.cellNumber, roles.value AS role FROM users INNER JOIN roles on users.roleId=roles.id WHERE companyId = " +req.query.companyId ;
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


users.put('/editUser', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };
    var userData = {
        "name": req.body.name,
        "email": req.body.email,
        "cellNumber": req.body.cellNumber,
        "roleId": req.body.roleId,
        "password": req.body.password,
    }

    sqlQuery = "UPDATE users SET name = " + "'" + userData.name + "'"  + ", email = " + "'"  + userData.email + "'"  +",  cellNumber = " + "'"  + userData.cellNumber + "'"  +",  roleId = " + "'"  + userData.roleId + "'"  +",  password = " + "'"  + userData.password + "'"  + " WHERE id = " + req.body.id;

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query(sqlQuery, function(err, rows, fields) {
                if (!err) {
                    appData.error = 0;
                    appData["data"] = "User registered successfully!";
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


users.delete('/deleteUser:id', function(req, res) {

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



var queryString = "SELECT users.id, users.name, users.password, users.email, users.cellNumber, roles.value AS role FROM users INNER JOIN roles on users.roleId=roles.id" ;


users.get('/getUser:id', function(req, res) {

    var appData = {};
    var id = req.params.id;
    const queryString = "SELECT users.id, users.name, users.email, users.password, users.cellNumber, users.roleId, roles.value AS role FROM users INNER JOIN roles on users.roleId=roles.id WHERE users.id = " + id;
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





module.exports = users;