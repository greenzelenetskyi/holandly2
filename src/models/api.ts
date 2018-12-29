import axios from 'axios';
import jwt from 'jsonwebtoken';
import { getEndpoint } from '../models/host';
import { Pool } from 'mysql';
import { logger } from '../config/host';


export const generateApiToken = (userId: number) => {
  return new Promise((reject, resolve) => {
    jwt.sign({ user: userId }, process.env.API_SECRET, { algorithm: process.env.API_ALGORITHM }, (err: Error, token: string) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

export const sendHookData = async (db: Pool, userId: number, resource: any) => {
  try {
    let hostData = await getEndpoint(db, userId);
    hostData = hostData[0].privatedata;
    if(hostData.hasOwnProperty('webhookUrl')) {
      let response = await axios.post(hostData.webhookUrl, resource);
    }
    
  } catch (err) {
    logger.error("hi" + err.message);
  }
}