const mysql = require('mysql')
const fs = require("fs");
const contents = fs.readFileSync("./config.json");
const config = JSON.parse(contents);

const connection = mysql.createConnection({
    host: 'localhost',
    user: config.dataBase.user,
    password: config.dataBase.password,
    database: 'testdb'
})

connection.connect();

connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
    if (err) {
        console.log(err)
    } else {
        console.log('The results is : ', results)
    }
})