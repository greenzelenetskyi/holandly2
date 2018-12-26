import { Request, Response } from "express";
import * as visitorModel from '../models/visitor';
import {dbPool, logger} from '../config/host';
import {type} from "os";

/**
 * Give to a visitor a page without specifying user.
 */
export const getTitlePage = (req: Request, res: Response) => {
    try {
        res.render('visitors/index', {title: 'Main page'})
    }
    catch (err) {
        logger.error(err)
    }
};

/**
 * Give to a visitor a specific user page.
 */
export const getUserPage = async (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    try {
        let userEvents = await visitorModel.getUserEvents(req.app.get('dbPool'), usr);
        res.render('visitors/index', {username: usr, userEvents: userEvents[0]})
    }
    catch (err) {
        logger.error(err)
    }
};

/**
 * Retrieving data about event visitors.
 */
export const getVisitors = async (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    let path: string = req.params.type;
    // let typePattern: string = req.params.type;
    try {
        // Getting a list of recorded events.
        let userEvents = await visitorModel.getUserEvents(req.app.get('dbPool'), usr);
        let typeEvents = await visitorModel.getTypeEvents(req.app.get('dbPool'), usr, path);
        res.render('visitors/event', {username: usr, eventType: path, userEvents: userEvents[0], typeEvents: typeEvents});
    }
    catch (err) {
        logger.error(err)
    }
};

/**
 * Record visitor to the event.
 */
export const visitorRegistration = async (req: Request, res: Response) => {
    let vtype = req.body.type;
    let vdate = req.body.date;
    let vtime = req.body.time;
    let vname = req.body.name;
    let vemail = req.body.email;
    let vuser = req.body.userName;
    try {
        // Checking the existence of the visitor actual record for the current event at a different time or date.
        let existRecord = await visitorModel.existingRecord(req.app.get('dbPool'), vtype, vdate, vtime, vemail, vuser);
        if (existRecord.length > 0) {
            res.status(400).json({ error: 'This visitor has already existed at this event' })
        }

        // Marking the cancellation of such records.
        let currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);
        await visitorModel.markCancellation(req.app.get('dbPool'), vtype, currentDay.toString(), vemail, vuser);

        // Record visitor to the event.
        let recVisitor = await visitorModel.visitorRecord(req.app.get('dbPool'), vtype, vdate, vtime, vemail, vname, vuser);
    }
    catch (err) {
        logger.error(err)
    }
};
