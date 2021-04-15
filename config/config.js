const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_DRIVER: process.env.DATABASE_DRIVER,
    DATABASE_PORT: process.env.DATABASE_PORT,
};