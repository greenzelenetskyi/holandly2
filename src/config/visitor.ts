import winston, { debug } from 'winston';
import mysql, {Pool} from 'mysql';
import session from 'express-session';

const MySqlStore = require('express-mysql-session')(session);

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/logv.log' }),
        new winston.transports.Console()
    ]
});

//db pool configuration which enables multiple reusable connections to a db
export const dbPool: Pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MySqlStore({}, dbPool)
};
