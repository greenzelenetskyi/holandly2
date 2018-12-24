import { Request, Response } from "express";
import * as visitorModel from '../models/visitor';
import {dbPool, logger} from '../config/visitor';
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
        let userEvents = await visitorModel.getUserEvents(dbPool, usr);
        res.render('visitors/index', {username: usr, userEvents: userEvents[0]})
    }
    catch (err) {
        logger.error(err)
    }
};

export const getVisitors = async (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    let path: string = req.params.type;
    let typePattern: string = req.params.type;
    try {
        let userEvents = await visitorModel.getUserEvents(dbPool, usr);
        let typeEvents = await visitorModel.getTypeEvents(dbPool, usr, path);
        res.render('visitors/event', {username: usr, eventType: path, userEvents: userEvents[0], typeEvents: typeEvents});
    }
    catch (err) {
        logger.error(err)
    }

    // dbPool.query

};
