import { Request, Response } from "express";
import * as visitorModel from '../models/visitor';
import { logger } from '../config/host';
import * as hostModel from "../models/host";
import { notify } from "../models/mailer";
import { insertToCalendar, deleteCalendarEvent } from "../models/calendar";
import { sendHookData } from "../models/api";
import moment = require("moment");
import { decryptData, useConfirmTemplate, useCancelTemplate, encryptData } from "./host";

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
    let path: string = req.params.uniqueId;
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
    let type = req.body.type;
    let date = req.body.date;
    let time = req.body.time;
    let name = req.body.name;
    let email = req.body.email;
    let eventUser = req.body.userName;
    let eventData = req.body.event_data;
    try {
        // Checking the existence of the visitor actual record for the current event at a different time or date.
        let existRecord = await visitorModel.existingRecord(req.app.get('dbPool'), type, date, time, email, eventUser);

        if (existRecord[0].amount > 0) {
            res.status(400).json({ error: 'This visitor has already existed at this event' });
            return;
        }

        // Marking the cancellation of such records.
        let findUserId = await visitorModel.userUniqId(req.app.get('dbPool'), eventUser);
        let userId = findUserId[0].userid;

        let currentDay = moment().format('YYYYMMDD');

        await visitorModel.markCancellationAll(req.app.get('dbPool'), type, currentDay, email, userId);

        // Record visitor to the event.
        let eventInformation = JSON.stringify({ 'description': eventData.description, 'location': eventData.location, 'title': eventData.title });
        
        let recVisitor = await visitorModel.visitorRecord(req.app.get('dbPool'), {type: type, date: date, time: time
                                                                                  , name: name, email: email
                                                                                  , event_data: eventInformation
                                                                                  , enableWebHook: req.body.enableWebHook
                                                                                  , userid: userId
                                                                                  , timezone: req.body.timezone} );

        let id = recVisitor.insertId;
        if (id != 0) {
            let event = await hostModel.getEventById(req.app.get('dbPool'), id);
            event[0].event_data = JSON.parse(event[0].event_data);
            res.send();
            await notify(event, req.body.userTitle, req.body.reason, 'Регистрация: ', useConfirmTemplate);
            await insertToCalendar(event[0], event[0].insertion_time.valueOf().toString() + id);
            if (event[0].enableWebHook) {
                let { enableWebHook, event_data, date, time, ...packet } = event[0];
                packet.timestamp = moment(date + ' ' + time, "DD-MM-YYYY HH:mm").valueOf();
                packet.timezone = req.body.timezone;
                sendHookData(req.app.get('dbPool'), userId, packet, 'registered');
            }
        }
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
        let id = decryptData(req.body.eventid);
        await visitorModel.markCancellation(req.app.get('dbPool'), id);
        let event = await hostModel.getEventById(req.app.get('dbPool'), id);
        event[0].event_data = JSON.parse(event[0].event_data);
        await notify(event, req.body.userTitle, req.body.reason, 'Отмена: ', useCancelTemplate);
        await deleteCalendarEvent(event[0].insertion_time.valueOf().toString() + id);
        if (event[0].enableWebHook) {
            let { enableWebHook, event_data, date, time, ...packet } = event[0];
            packet.timestamp = moment(date + ' ' + time, "DD-MM-YYYY HH:mm").valueOf();
            sendHookData(req.app.get('dbPool'), req.body.userid, packet, 'cancelled');
        }
        res.send();
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
    try {
        let reject: any = decryptData(req.params.eventId);
        let eventInformation = await visitorModel.getEventInformation(req.app.get('dbPool'), reject);
        eventInformation[0].eventid = req.params.eventId;
        res.render('visitors/cancellation', { eventInfo: eventInformation[0] });
    }
    catch (err) {
        logger.error(err.message);
        res.status(500).end();
    }
};