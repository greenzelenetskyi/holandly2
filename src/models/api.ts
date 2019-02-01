import axios, { AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import { getEndpoint } from '../models/host';
import { Pool } from 'mysql';
import { logger } from '../config/host';
import { sendNotification } from './mailer';
import { useHookTemplate } from '../controllers/host';


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

export const sendHookData = async (db: Pool, userId: number, resource: any, operation: string) => {
  try {
    let hostData = await getEndpoint(db, userId);
    hostData = JSON.parse(hostData[0].privatedata);
    if (hostData.hasOwnProperty('webhookUrl')) {
      let response: AxiosResponse;
      response = await axios.post(hostData.webhookUrl + operation, resource);
      if(response.status != 200) {
        sendNotification(process.env.DOMAIN_MAIL
          , "API HOOK SERVICE FAILURE", {reason: "The destination server response status is not 200"}, useHookTemplate);
      }
    }
  } catch (err) {
    logger.error(err.stack);
    sendNotification(process.env.DOMAIN_MAIL, "API HOOK SERVICE FAILURE", {reason: err.stack}, useHookTemplate);
  }
}