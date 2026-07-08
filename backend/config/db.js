const mysql=require('mysql2');
require('dotenv').config();

const pool = mysql.createpool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 10,
    queueLimit : 0
});

const db = pool.promise();

pool.getConnection((err , connection)=>{
    if(err){
        console.error ('MYSQL connection failed:' , err.message);
        return;

    }
    console.log('MYSQL connected successfully'); 
    connection.release();
});

module.exports = db;
