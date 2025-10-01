const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: '5432',
    password: '1234567',
    database: 'Proyecto_Restaurante'
});


module.exports = pool;
