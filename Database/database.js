var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit: 100,
    host:'154.0.166.235',
    user:'kylegoux_Christo',
    password:'Christo123?',
    database:'kylegoux_findafreight',
    port: 3306,
    debug: false,
    multipleStatements: true
});

module.exports.connection = connection;