import * as visitorController from '../controllers/visitor';

const visit = require('express');
export const visitor = visit.Router();

visitor.get('/', visitorController.getTitlePage);

visitor.get('/rejection/:eventId', visitorController.getRejection);

visitor.get('/:userName', visitorController.getUserPage);
//visitor.get('/:userName/', visitorController.getUserPage);

visitor.get('/:userName/:uniqueId', visitorController.getVisitors);

visitor.post('/sign', visitorController.visitorRegistration);

visitor.post('/cancel', visitorController.visitorCancellation);

