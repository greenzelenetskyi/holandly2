import express from 'express';
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
host.post('/event', hostController.addAppointment);

host.get('/events', hostController.getAppointments);

host.put('/cancel', hostController.cancelAppointment, (req, res) => { res.end()});

host.put('/attended', hostController.markAttended);

host.put('/reschedule', hostController.cancelAppointment, (req, res) => {res.redirect('/' + req.user.username)});