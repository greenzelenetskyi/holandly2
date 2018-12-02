import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import { logger, dbPool } from './config/host';
import { host } from './routes/host';
import os from 'os';
import cluster from 'cluster';
import compression from 'compression';
import helmet from 'helmet';
const numCPUs = os.cpus().length;

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

    app.use('/', host);

    app.listen(process.env.PORT, () => {
        logger.info('The server listens to the port 8130');
    });
}
