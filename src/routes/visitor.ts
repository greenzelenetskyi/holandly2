import express from 'express';
import * as visitorController from '../controllers/visitor';
import passport from 'passport';

export const visitor = express.Router();

const visit = require('express');
// exports.router = express.Router();

const mysql = require('mysql');

visit.get('/', visitorController.getTitlePage);

visit.get('/:userName', visitorController.getUserPage);