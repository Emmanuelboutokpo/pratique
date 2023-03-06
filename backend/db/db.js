const mysql = require('mysql2');

const connection = mysql.createConnection({
  host  : 'localhost',
  user  : 'root',
  password : "",
  database : 'orotiaye'
});


module.exports = connection;