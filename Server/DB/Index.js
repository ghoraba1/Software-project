require('dotenv').config({path: '../.env'});
const knex = require('knex');
// installing Knex is essintial to write queries with SQL to get or write data in the database
//if the env file is not in the same directory, we need to add the relative path for the env file in the config as written in line 1
const config = {
    client: 'pg',    //This package is essential to work with postgres
    connection: {
        host: process.env.PGHOST, //we are using .env files for security pla pla
        port: process.env.PGPORT, 
        user: process.env.PGUSER,
        password: process.env.PGPASSWARD,
        database: process.env.PGDATABASE,
    }
};

const DB = knex(config);
 
module.exports = DB;
//We use this line to be able to use this file in other files. 

DB.raw('SELECT 1')
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });

    //This query returns 1 ,we are using it to test if the connection to the data base is established. 