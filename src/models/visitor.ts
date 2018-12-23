import { Pool, MysqlError } from 'mysql';

const makeSqlQueryString = (db: Pool, sqlString: string, params?: string): Promise<string> => {
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

//  *******************  Used types  ***********************************************

type eventForTimeline = {
    date: Date, time: string };

type timelineEvents = [eventForTimeline];

//  *******************  End of used types  ****************************************
