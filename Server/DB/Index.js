require('dotenv').config();
const knex = require('knex') ;
const { Connection } = require('pg');

const config ={
    client: 'pg' ,
    Connection:{
        host:process.env.PGHOST ,
        port:process.env.PGPORT ,
        user:process.env.PGUSER ,
        password:process.env.PGPASSWORD ,
        database:process.env.PGDATABASE ,
    }
}

const DB = knex(config) ;

module.exports = DB ;
