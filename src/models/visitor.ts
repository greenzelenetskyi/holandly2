import { Pool, MysqlError } from 'mysql';

const makeSqlQueryString = (db: Pool, sqlString: string, params: string | number): Promise<string | eventInf> => {
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
                     FROM host
                     WHERE username = ?`;
    return makeSqlQueryString(db, sqlString, userName)
};

export const getEventInformation = (db: Pool, event: number) => {
    let sqlString = `SELECT h.username, h.userid, h.publicdata AS userEvents
                     FROM host h
                            LEFT JOIN scheduled_events e ON h.userid = e.userid
                     WHERE e.eventid = ?`;
    return makeSqlQueryString(db, sqlString, event);
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
                    FROM scheduled_events e
                           LEFT JOIN host h ON e.userid = h.userid
                    WHERE h.username = ?
                      AND e.type = ?
                      AND e.cancelledbyhost = 0
                      AND e.cancelledbyvisitor = 0`;
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

export const markCancellationAll = (db: Pool, type: string, date: string, email: string, userid: number) => {

    let sqlQueryCancelled = `UPDATE scheduled_events 
                             SET cancelledbyvisitor = 1
                             WHERE userid = ?
                               AND type = ?
                               AND email = ?
                               AND concat(mid(date,7,4),mid(date,4,2),mid(date,1,2)) >= ?
                               AND cancelledbyhost = 0
                               AND cancelledbyvisitor = 0`;
    return makeSqlQueryArString(db, sqlQueryCancelled, [userid, type, email, date]);
};

export const markCancellation = (db: Pool, eventid: number) => {
    let sqlQueryCancelled = `UPDATE scheduled_events 
                             SET cancelledbyvisitor = 1
                             WHERE eventid = ?`;
    return makeSqlQueryArString(db, sqlQueryCancelled, [eventid]);
};

export const userUniqId = (db: Pool, user: string) => {
    let sqlQueryData = `SELECT userid 
                        FROM host
                        WHERE username = ?`;
    return makeSqlQueryArString(db, sqlQueryData, [user]);
};

export const visitorRecord = (db: Pool, type: string, date: string, time: string, email: string, name: string, userid: number, eventData: string): Promise<any> => {
    let sqlQueryRecord = `INSERT INTO scheduled_events (userid, type, date, time, email, name, event_data)
                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return makeSqlQueryArString(db, sqlQueryRecord, [userid, type, date, time, email, name, eventData]);
};

//  *******************  Used types  ***********************************************

type eventForTimeline = {
    date: Date, time: string
};

type timelineEvents = [eventForTimeline];

type arrayParams = [number, string?, string?, string?, string?, string?, string?];

type eventInf = [ { username: string, userEvents: string} ];

//  *******************  End of used types  ****************************************
