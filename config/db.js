require('dotenv').config();
const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });


const pool = mysql.createPool(process.env.DATABASE_URL)

pool.getConnection(function (err, connection) {
    if (err) {
        console.log('Error getting connection from database  ' + err.message);
        return;
    }
    console.log('connection from database');
    connection.release();
})

module.exports = pool.promise()