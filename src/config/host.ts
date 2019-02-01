import winston, { debug } from 'winston';
import mysql from 'mysql';
import session from 'express-session';
import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';

const MySqlStore = require('express-mysql-session')(session);

export const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/log.log' })
    ]
});

//db pool configuration which enables multiple reusable connections to a db
export const dbPool = mysql.createPool({
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

const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
};

export const mailer = nodemailer.createTransport(mailgun(mailgunOptions));
