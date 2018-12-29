import { Pool, MysqlError } from 'mysql';

const makeSqlQueryString = (db: Pool, sqlString: string, params: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        db.query(sqlString, params, (err: MysqlError, result: string) => {
            if (err) {
                return reject(err)
            }
            resolve(result)
        })
    })
};

export const getUserEvents = (db: Pool, userName: string) => {

    let sqlString = `SELECT publicdata AS userEvents
                     FROM holandly.host
                     WHERE username = ?`;
    return makeSqlQueryString(db, sqlString, userName)
};

const makeSqlQueryEvents = (db: Pool, sqlQuery:string, name: string, pattern: string): Promise<timelineEvents> => {
    return new Promise((resolve, reject) => {
        db.query(sqlQuery, [name, pattern], (err: MysqlError, results: timelineEvents) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
};

export const getTypeEvents = (db: Pool, userName: string, typePattern: string) => {
    let sqlQuery = `SELECT e.date, e.time
                    FROM holandly.scheduled_events e
                           LEFT JOIN holandly.host h ON e.userid = h.userid
                    WHERE h.username = ?
                      AND e.type = ?`;
    return makeSqlQueryEvents(db, sqlQuery, userName, typePattern)
};

const makeSqlQueryArString = (db: Pool, sqlQuery:string, params: string[] | arrayParams): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sqlQuery, params, (err: MysqlError, results: number) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
};

export const existingRecord = (db: Pool, type: string, date: string, time: string, email: string, user: string) => {
    let sqlQueryDuplicate = `SELECT count(e.eventid) as amount
                             FROM scheduled_events e
                                    LEFT JOIN host h ON e.userid = h.userid
                             WHERE h.username = ?
                               AND e.type = ?
                               AND e.email = ?
                               AND e.date = ?
                               AND e.time = ?
                               AND e.cancelledbyhost = 0
                               AND e.cancelledbyvisitor = 0`;
    return makeSqlQueryArString(db, sqlQueryDuplicate, [user, type, email, date, time]);
};

export const markCancellationAll = (db: Pool, type: string, date: string, email: string, user: string) => {
    let sqlQueryCancelled = `UPDATE scheduled_events e LEFT JOIN host h ON e.userid = h.userid
                             SET e.cancelledbyvisitor = 1
                             WHERE h.username = ?
                               AND e.type = ?
                               AND e.email = ?
                               AND e.date >= ?
                               AND e.cancelledbyhost = 0
                               AND e.cancelledbyvisitor = 0`;
    return makeSqlQueryArString(db, sqlQueryCancelled, [user, type, email, date]);
};

export const markCancellation = (db: Pool, type: string, date: string, time: string, email: string, user: string) => {
    let sqlQueryCancelled = `UPDATE scheduled_events e LEFT JOIN host h ON e.userid = h.userid
                             SET e.cancelledbyvisitor = 1
                             WHERE h.username = ?
                               AND e.type = ?
                               AND e.email = ?
                               AND e.date = ?
                               AND e.time = ?
                               AND e.cancelledbyhost = 0
                               AND e.cancelledbyvisitor = 0`;
    return makeSqlQueryArString(db, sqlQueryCancelled, [user, type, email, date, time]);
};

export const userUniqId = (db: Pool, user: string) => {
    let sqlQueryData = `SELECT userid 
                        FROM host
                        WHERE username = ?`;
    return makeSqlQueryArString(db, sqlQueryData, [user]);
};

export const visitorRecord = (db: Pool, type: string, date: string, time: string, email: string, name: string, userid: number, eventData: string): Promise<any> => {
    let sqlQueryRecord = `INSERT INTO scheduled_events (type, date, time, email, name, userid, event_data)
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return makeSqlQueryArString(db, sqlQueryRecord, [type, date, time, email, name, userid, eventData]);
};

//  *******************  Used types  ***********************************************

type eventForTimeline = {
    date: Date, time: string };

type timelineEvents = [eventForTimeline];

type arrayParams = [string, string, string, string, string, number, string];

//  *******************  End of used types  ****************************************
