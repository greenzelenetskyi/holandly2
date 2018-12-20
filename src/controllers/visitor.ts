import { Request, Response } from "express";
import * as visitorModel from '../models/visitor';
import {dbPool, logger} from '../config/visitor';
import {Pool} from "mysql";

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
}

/**
 * Give to a visitor a specific user page.
 */
export const getUserPage = (req: Request, res: Response) => {
    let usr: string = req.params.userName;
    try {
        let dBase: Pool = dbPool;
        let userEvents = visitorModel.getUserEvents(dbPool, usr);
        res.render('visitors/index', {username: usr, userEvents: userEvents})
    }
    catch (err) {
        logger.error(err)
    }
}
