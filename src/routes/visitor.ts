// import express from 'express';
import * as visitorController from '../controllers/visitor';
// import passport from 'passport';

const visit = require('express');
export const visitor = visit.Router();


// exports.router = express.Router();

// const mysql = require('mysql');

visitor.get('/', visitorController.getTitlePage);

visitor.get('/:userName', visitorController.getUserPage);

visitor.get('/:userName/:type', visitorController.getVisitors);