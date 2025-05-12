// MySQL connection for Hostinger
const mysql = require('mysql2/promise');
const { drizzle } = require('drizzle-orm/mysql2');
const schema = require('../shared/schema');

// Database connection configuration
const poolConfig = {
  host: 'localhost',
  user: 'u670813828_royal',
  password: ':6rpOG31Y',
  database: 'u670813828_royal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(poolConfig);
const db = drizzle(pool, { schema });

module.exports = { pool, db };
