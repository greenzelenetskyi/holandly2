import { Request, Response } from "express";
import * as visitorModel from '../models/visitor';
import { dbPool, logger } from '../config/host';
import * as hostModel from "../models/host";
import { notify } from "../models/mailer";
import { insertToCalendar } from "../models/calendar";
import pug from "pug";
import path from "path";
import { sendHookData } from "../models/api";
import moment = require("moment");
import { encryptData, decryptData } from "./host";

const useConfirmTemplate = pug.compileFile(path.join(__dirname, '../../views/emails/confirmation.pug'));

/**
 * Give to a visitor a page without specifying user.
 */
export const getTitlePage = (req: Request, res: Response) => {
    try {
        res.render('visitors/index', { title: 'Main page' })
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};

/**
 * Give to a visitor a specific user page.
 */
export const getUserPage = async (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    try {
        let userEvents = await visitorModel.getUserEvents(req.app.get('dbPool'), usr);
        res.render('visitors/index', { username: usr, userEvents: userEvents[0] })
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};

/**
 * Retrieving data about event visitors.
 */
export const getVisitors = async (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    let path: string = req.params.type;
    try {
        // Getting a list of recorded events.
        let userEvents = await visitorModel.getUserEvents(req.app.get('dbPool'), usr);
        let typeEvents = await visitorModel.getTypeEvents(req.app.get('dbPool'), usr, path);
        res.render('visitors/event', { username: usr, eventType: path, userEvents: userEvents[0], typeEvents: typeEvents });
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};

/**
 * Record visitor to the event.
 */
export const visitorRegistration = async (req: Request, res: Response) => {
    let eventType = req.body.type;
    let eventDate = req.body.date;
    let eventTime = req.body.time;
    let eventName = req.body.name;
    let eventEmail = req.body.email;
    let eventUser = req.body.userName;
    let eventData = req.body.event_data;
    try {
        // Checking the existence of the visitor actual record for the current event at a different time or date.
        let existRecord = await visitorModel.existingRecord(req.app.get('dbPool'), eventType, eventDate, eventTime, eventEmail, eventUser);

        if (existRecord[0].amount > 0) {
            res.status(400).json({ error: 'This visitor has already existed at this event' });
            return;
        }

        // Marking the cancellation of such records.
        let findUserId = await visitorModel.userUniqId(req.app.get('dbPool'), eventUser);
        let userId = findUserId[0].userid;

        let currentDay = moment().format('YYYYMMDD');

        await visitorModel.markCancellationAll(req.app.get('dbPool'), eventType, currentDay, eventEmail, userId);

        // Record visitor to the event.
        let eventInformation = JSON.stringify({ 'description': eventData.description, 'location': eventData.location, 'title': eventData.title });
        let recVisitor = await visitorModel.visitorRecord(req.app.get('dbPool'), eventType, eventDate, eventTime, eventEmail, eventName, userId, eventInformation);

        let id = recVisitor.insertId;
        if (id != 0) {
            let event = await hostModel.getEventById(req.app.get('dbPool'), id);
            event[0].event_data = JSON.parse(event[0].event_data);
            await notify(event, eventUser, req.body.reason, 'Регистрация: ', useConfirmTemplate);
            await insertToCalendar(event[0], event[0].insertion_time.valueOf().toString() + id);
        }
        if (req.body.enableWebHook && req.body.enableWebHook === true) {
            sendHookData(req.app.get('dbPool'), userId, { type: eventType, date: eventDate, time: eventTime });
        }
        res.end();


    } catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};


/**
 * Cancel visitor from the event.
 */
export const visitorCancellation = async (req: Request, res: Response) => {
    try {
        await visitorModel.markCancellation(req.app.get('dbPool'), req.body.eventid);
        let event = await hostModel.getEventById(req.app.get('dbPool'), req.body.eventid);
        event[0].event_data = JSON.parse(event[0].event_data);
        await notify(event, req.body.title, req.body.reason, 'Регистрация: ', useConfirmTemplate);
        await insertToCalendar(event[0], event[0].insertion_time.valueOf().toString() + req.body.eventid);
        if (req.body.enableWebHook && req.body.enableWebHook === true) {
            let {packet, event_data} = event[0];
            sendHookData(req.app.get('dbPool'), req.body.userid, packet);
        }
        res.end();
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};

/**
 * Confirmation of the visitor failure from the event.
 */
export const getRejection = async (req: Request, res: Response) => {
    // let reject: any = decryptData(req.params.eventId);
    let reject = req.params.eventId;
    try {
        let eventInformation = await visitorModel.getEventInformation(req.app.get('dbPool'), reject);
        res.render('visitors/cancellation', { eventInfo: eventInformation[0]} );
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};
