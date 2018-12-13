import express, { Request, Response } from 'express';
import * as hostController from '../controllers/host';
import passport from 'passport';

export const host = express.Router();

host.use(hostController.requireLogin);

host.get('/', hostController.getMainPage);

host.route('/login')
  .get(hostController.getLoginPage)
  .post(passport.authenticate('local'), (req, res) => { res.redirect('/edit') });

host.get('/logout', hostController.stopSession);

host.route('/config')
  .get(hostController.getConfigData)
  .post(hostController.setConfiguration);