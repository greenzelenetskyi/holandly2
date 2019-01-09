import { Request, Response } from "express";
import * as hostModel from '../models/host';
import { logger } from '../config/host';
import { notify } from '../models/mailer';
import pug from 'pug';
import path from 'path';
import { deleteCalendarEvent, insertToCalendar } from '../models/calendar';
import jwt from 'jsonwebtoken';

const useCancelTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/cancellation.pug'));
const useConfirmTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/confirmation.pug'));
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
        let publicData = req.body;
        let configuration = { ...req.body }
        filterPrivateData(publicData, privateData);
        let status = await hostModel.updateHostData(req.app.get('dbPool'), {
            configuration: JSON.stringify(configuration),
            publicdata: JSON.stringify(publicData),
            privatedata: JSON.stringify(privateData),
            title: req.body.toplevel.title
        }, req.user.userId);
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

const filterPrivateData = (config: any, secureData: any, parent?: any) => {
    for (let property in config) {
        if (config.hasOwnProperty(property)) {
            if (property.startsWith(process.env.SECRET_PREFIX)) {
                if (parent) {
                    secureData[parent] = secureData[parent] ? secureData[parent] : {};
                    secureData[parent][property.substring(1)] = config[property];
                } else {
                    secureData[property.substring(1)] = config[property];
                }
                delete config[property];
            } else {
                if (typeof config[property] === 'object') {
                    filterPrivateData(config[property], secureData, property);
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
        for (let eventId of req.body.events) {
            let result = await hostModel.cancelAppointment(req.app.get('dbPool'), eventId);
            if (result.affectedRows > 0) {
                let eventData = await hostModel.getEventById(req.app.get('dbPool'), eventId);
                eventData.forEach((e: any) => {
                    e.event_data = JSON.parse(e.event_data);
                })
                notify(eventData, req.user.title, req.body.reason, 'Отмена события: ', useCancelTemplate);
                deleteCalendarEvent(eventData[0].insertion_time.valueOf().toString() + eventId);
            }
        }
        res.json();
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const addAppointment = async (req: Request, res: Response) => {
    try {
        req.body.event_data = JSON.stringify(req.body.event_data)
        let duplicate = await hostModel.findDuplicate(req.app.get('dbPool'), req.body);
        if (duplicate.length > 0) {
            res.status(400).json({ error: 'This appointment already exists' })
        } else {
            let result = await hostModel.insertScheduledEvent(req.app.get('dbPool'), req.body);
            let id = result.insertId;
            if (id != 0) {
                let event = await hostModel.getEventById(req.app.get('dbPool'), id);
                event[0].event_data = JSON.parse(event[0].event_data);
                await notify(event, req.user.title, req.body.reason, 'Регистрация: ', useConfirmTemplate);
                insertToCalendar(event[0], event[0].insertion_time.valueOf().toString() + id);
            }
            res.json();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const markAttended = async (req: Request, res: Response) => {
    try {
        for (let id of req.body.eventid) {
            await hostModel.markShowedUp(req.app.get('dbPool'), id);
        }
        res.end();
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const createApiToken = async (req: Request, res: Response) => {
    try {
        let token = jwt.sign({ user: req.user.userId }
            , process.env.API_SECRET, { algorithm: process.env.API_ALGORITHM });
        let result = await hostModel.updateHostData(req.app.get('dbPool'), { api_token: token }, req.user.userId);
        if (result.affectedRows > 0) {
            res.json({ apiToken: token })
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const getApiToken = async (req: Request, res: Response) => {
    try {
        let result = await hostModel.retrieveApiToken(req.app.get('dbPool'), req.user.userId);
        if (result.length > 0) {
            res.json({ apiToken: result[0].api_token });
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const getEvent = async (req: Request, res: Response) => {
    try {
        let result = await hostModel.getEventById(req.app.get('dbPool'), req.params.eventId);
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(400).json();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}

export const cancelEvent = async (req: Request, res: Response) => {
    try {
        let id = req.params.eventId;
        let result = await hostModel.cancelAppointment(req.app.get('dbPool'), id);
        if (result.affectedRows > 0) {
            let event = await hostModel.getEventById(req.app.get('dbPool'), id);
            event[0].event_data = JSON.parse(event[0].event_data);
            await notify(event, req.user.title, req.body.reason, 'Отмена: ', useCancelTemplate);
            deleteCalendarEvent(event[0].insertion_time.valueOf().toString() + id);
            res.json();
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
}