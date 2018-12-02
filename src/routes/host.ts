import express, { Request, Response } from 'express';
import * as hostController from '../controllers/host';

export const host = express.Router();

host.route('/config')
  .get(hostController.getConfigData)
  .post(hostController.setConfiguration);