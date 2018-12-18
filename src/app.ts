import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import { logger, dbPool, sessionConfig } from './config/host';
import { findUser } from './models/host';
import { host } from './routes/host';
import os from 'os';
import cluster from 'cluster';
import compression from 'compression';
import helmet from 'helmet';
import passportLocal from 'passport-local';
import path from 'path';
import passport = require('passport');
const numCPUs = os.cpus().length;

const LocalStrategy = passportLocal.Strategy;

const authenticateUser = async (username: string, password: string, callback: Function) => {
    try {
        let user = await findUser({ username: username }, dbPool);
        if (user.length === 0) {
            return callback(null, false);
        }
        if (user[0].password !== password) {
            return callback(null, false);
        }
        return callback(null, user[0]);
    } catch (err) {
        callback(err);
    }
}

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function () {
        cluster.fork();
    });

} else {
    const app = express();

    app.use(compression());
    app.use(helmet());
    // can be retreived in other modules through req.app.get
    app.set('dbPool', dbPool);
    app.use(bodyParser.json());

    app.use(sessions(sessionConfig));

    passport.use(new LocalStrategy(authenticateUser));


    app.use(passport.initialize());
    app.use(passport.session());

    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'pug');

    passport.serializeUser((user: any, done) => {
        delete user.password;
        done(null, user);
    });
    passport.deserializeUser(async (user: any, done) => {
        try {
          let usr = await findUser({ userId: user.userId }, dbPool);
          delete usr[0].password;
          done(null, usr[0]);
        } catch (err) {
          logger.error(err);
        }
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/:clientname?/edit', host);

    app.listen(process.env.PORT, () => {
        logger.info('The server listens to the port 8130');
    });
}