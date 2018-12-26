import * as visitorController from '../controllers/visitor';

const visit = require('express');
export const visitor = visit.Router();

visitor.get('/', visitorController.getTitlePage);

visitor.get('/:userName', visitorController.getUserPage);

visitor.get('/:userName/:type', visitorController.getVisitors);

visitor.post('/sign', visitorController.visitorRegistration);