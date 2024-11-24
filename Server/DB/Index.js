require('dotenv').config({path: '../.env'});
const knex = require('knex');

const config = {
    client: 'pg',
    connection: {
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWARD,
        database: process.env.PGDATABASE,
    }
};

const DB = knex(config);
 
module.exports = DB;

// Example query to test the connection

DB.raw('SELECT 1')
    .then(() => {
        console.log('Connected to the database');
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
    });
