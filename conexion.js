
var mysql = require('mysql');
var connection;
connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'admin',
  password: 'adm1n',
  database: 'pilates_virtual_class',
  insecureAuth: 'true'
});
module.exports = connection;
