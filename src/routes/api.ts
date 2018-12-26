import express from 'express';
import bodyParser from 'body-parser';
import * as api from '../controllers/api';
import { getAppointments, cancelAppointment, getEvent, cancelEvent } from '../controllers/host';

export const apiRouter = express.Router();

apiRouter.use(bodyParser.json());

apiRouter.get('/event/:eventId', api.checkToken, api.checkApiKey, getEvent);

apiRouter.delete('/event/:eventId/', api.checkToken, api.checkApiKey, cancelEvent);