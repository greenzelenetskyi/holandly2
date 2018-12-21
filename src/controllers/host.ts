import { Request, Response } from "express";
import * as hostModel from '../models/host';
import { logger } from '../config/host';
import { notify } from '../models/mailer';
import pug from 'pug';
import path from 'path';

const useCancelTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/cancellation.pug'));
const useConfirmTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/confirmation.pug'));
const useRescheduleTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/reschedule.pug'));

export const requireLogin = (req: Request, res: Response, next: Function) => {
    if (req.path == '/login') {
        next();
    } else if (!req.isAuthenticated()) {
        res.redirect('/edit/login');
    } else {
        next();
    }
}

export const getMainPage = (req: Request, res: Response) => {
    try {
        res.render('users/personal', { login: req.user.username });
    } catch (err) {
        logger.error(err.message)
    }
}

export const getLoginPage = (req: Request, res: Response) => {
    try {
        res.render('users/signIn');
    } catch (err) {
        logger.error(err.message)
    }
}

export const stopSession = (req: Request, res: Response) => {
    req.session.destroy((err: Error) => {
        if (err)
            throw err;
        res.redirect('/edit/login');
    });
}


export const setConfiguration = async (req: Request, res: Response) => {
    try {
        let privateData = {};
        let configuration;
        let publicData = configuration = req.body;
        filterPrivateData(publicData, privateData);
        let status = await hostModel.updateConfig(req.app.get('dbPool'), 
                     configuration, publicData, privateData, req.user.userId);
        if (status.affectedRows > 0) {
            res.end();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

const filterPrivateData = (config: any, secureData: any) => {
    for (let property in config) {
        if (config.hasOwnProperty(property)) {
            if (property.startsWith(process.env.SECRET_PREFIX)) {
                secureData[property.substring(1)] = config[property];
                delete config[property];
            } else {
                if (typeof config[property] === 'object') {
                    filterPrivateData(config[property], secureData);
                }
            }
        }
    }
}

export const getConfigData = async (req: Request, res: Response) => {
    try {
        let json = await hostModel.getConfigData(req.app.get('dbPool'), 'configuration', req.user.userId);
        if (json.length > 0) {
            res.json(JSON.parse(json[0].configuration));
        }
        res.status(400).end();
    } catch (err) {
        logger.error(err.message);
    }
}

export const getAppointments = async (req: Request, res: Response) => {
    try {
        let appointments = await hostModel.getActiveEvents(req.app.get('dbPool'), req.user.userId);
        res.json(appointments);
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        for(let eventId of req.body.events) {
            let result = await hostModel.cancelAppointment(req.app.get('dbPool'), eventId);
            if(result.affectedRows > 0) {
                let notificationData = await hostModel.getEventById(req.app.get('dbPool'), eventId);
                notify(notificationData, req.user.title, req.body.reason, 'Отмена события: ', useCancelTemplate)
            }
          }
          res.end();
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const addAppointment = async (req: Request, res: Response) => {
    try {
        let duplicate = await hostModel.findDuplicate(req.app.get('dbPool'), req.body);
        if(duplicate.length > 0) {
            res.status(400).json({error: 'This appointment already exists'})
        }
        await hostModel.insertScheduledEvent(req.app.get('dbPool'), req.body);
        res.end();
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const markAttended = async (req: Request, res: Response) => {
    try {
        for(let id of req.body.eventid) {
            await hostModel.markShowedUp(req.app.get('dbPool'), id);
        }
        res.end();
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

