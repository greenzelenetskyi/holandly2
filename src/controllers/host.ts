import { Request, Response } from "express";
import * as hostModel from '../models/host';
import { logger } from '../config/host';
import { notify } from '../models/mailer';
import pug from 'pug';
import path from 'path';
import { deleteCalendarEvent, insertToCalendar } from '../models/calendar';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import moment from 'moment';

export const useCancelTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/cancellation.pug'));
export const useConfirmTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/confirmation.pug'));
export const useHookTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/hook-failure.pug'));

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
        logger.error(err.stack)
    }
}

export const getLoginPage = (req: Request, res: Response) => {
    try {
        res.render('users/signIn');
    } catch (err) {
        logger.error(err.stack)
    }
}

export const stopSession = (req: Request, res: Response) => {
    req.session.destroy((err: Error) => {
        if (err)
            throw err;
        res.redirect('/edit/login');
    });
}

const findNonUniqueEvents = (types: any) => {
    let tempArray: any = [];
    for (let current in types) {
        if (types.hasOwnProperty(current)) {
            if (tempArray.indexOf(types[current].uniqueId) !== -1) {
                return true;
            } else {
                tempArray.push(types[current].uniqueId);
            }
        }
    }
}

export const setConfiguration = async (req: Request, res: Response) => {
    try {
        let privateData = {};
        let publicData = req.body;
        let configuration = { ...req.body };
        let hasNonUniqueEvents = findNonUniqueEvents(publicData.types);
        if (hasNonUniqueEvents) {
            res.status(400).json({ message: 'поле uniqueId должно быть уникальным для каждого события' })
        } else {
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
                res.status(400).json({ message: 'проверьте правильно ли вы ввели все данные' });
            }
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).json({ message: 'ошибка на сервере. Попробуйте еще раз или свяжитесь с нами'});
    }
}

const filterPrivateData = (config: any, secureData: any, parent?: any): any => {
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
        let json = await hostModel.getHostData(req.app.get('dbPool'), 'configuration', req.user.userId);
        if (json.length > 0) {
            res.json(JSON.parse(json[0].configuration));
        }
        res.status(400).end();
    } catch (err) {
        logger.error(err.stack);
    }
}

export const getAppointments = async (req: Request, res: Response) => {
    try {
        let appointments = await hostModel.getActiveEvents(req.app.get('dbPool'), req.user.userId);
        res.json(appointments);
    } catch (err) {
        logger.error(err.stack);
        res.status(500).end();
    }
}

export const cancelAppointment = async (req: Request, res: Response) => {
    try {
        for (let eventId of req.body.events) {
            let result = await hostModel.cancelAppointment(req.app.get('dbPool'), eventId, req.user.userId);
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
        logger.error(err.stack);
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
        logger.error(err.stack);
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
        logger.error(err.stack);
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
        logger.error(err.stack);
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
        logger.error(err.stack);
        res.status(500).end();
    }
}

export const getEvent = async (req: Request, res: Response) => {
    try {
        let result = await hostModel.getEventById(req.app.get('dbPool'), req.params.eventId, req.user);
        if (result.length > 0) {
            delete result[0].event_data;
            let { enableWebHook, date, time, ...event } = result[0];
            event.timestamp = moment(date + ' ' + time, "DD-MM-YYYY HH:mm").valueOf();
            res.json(event);
        } else {
            res.status(400).json();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).end();
    }
}

export const cancelEvent = async (req: Request, res: Response) => {
    try {
        let id = req.params.eventId;
        let result = await hostModel.cancelAppointment(req.app.get('dbPool'), id, req.user);
        if (result.affectedRows > 0) {
            let event = await hostModel.getEventById(req.app.get('dbPool'), id);
            event[0].event_data = JSON.parse(event[0].event_data);
            res.json();
            await notify(event, req.user.title, req.body.reason, 'Отмена: ', useCancelTemplate);
            deleteCalendarEvent(event[0].insertion_time.valueOf().toString() + id);
        } else {
            res.status(400).end();
        }
    } catch (err) {
        logger.error(err.stack);
        res.status(500).end();
    }
}


export const encryptData = (rawData: string) => {
    const algorithm = 'aes-192-cbc';

    const key = crypto.scryptSync(process.env.PASSWORD, process.env.SALT, 24);

    const iv = Buffer.alloc(16, 0);  // Initialization vector

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(rawData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const decryptData = (encrypted: any) => {
    const algorithm = 'aes-192-cbc';
    const key = crypto.scryptSync(process.env.PASSWORD, process.env.SALT, 24);

    const iv = Buffer.alloc(16, 0); // Initialization vector.

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
} 