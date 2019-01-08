import { Pool, MysqlError } from 'mysql';

const makeSqlQuery = (db: Pool, sqlString: string, params?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      db.query(sqlString, params, (err: MysqlError, result: Object[]) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      })
    })
  }

export const getActiveEvents = (db: Pool, userId: number) => {
  let sqlString = `SELECT eventid, name, email, type AS event, date AS dateEvent, time AS timeEvent, showed_up as attended, insertion_time
   FROM scheduled_events WHERE userid=? && cancelledbyhost <> 1 && cancelledbyvisitor <> 1`;
  return makeSqlQuery(db, sqlString, userId);
}

export const cancelAppointment = (db: Pool, eventid: number) => {
  let sqlString = `UPDATE scheduled_events SET cancelledbyhost=1 WHERE eventid=?`;
  return makeSqlQuery(db, sqlString, eventid);
}

export const updateHostData = (db: Pool, update: any, userId: number) => {
    let sqlString = `UPDATE host SET ? WHERE userid=?`;
    return makeSqlQuery(db, sqlString, [update, userId]
    );
}

export const getConfigData = (db: Pool, field: string, userid: number) => {
  let sqlString = `SELECT ?? FROM host WHERE userid=?`;
  return makeSqlQuery(db, sqlString, [field, userid]);
}

export const findUser = (param: object, db: Pool) => {
  let sqlString = `SELECT userId, title, username, password FROM host WHERE ?`;
  return makeSqlQuery(db, sqlString, param);
}

export const insertScheduledEvent = (db: Pool, data: any) => {
  let sqlString = `INSERT INTO scheduled_events SET ?`;
  return makeSqlQuery(db, sqlString, data);
}

export const findDuplicate = (db: Pool, data: any) => {
  let sqlString = `SELECT eventId FROM scheduled_events WHERE type = ? && date = ? && time = ? && email = ?`;
  return makeSqlQuery(db, sqlString, [data.type, data.date, data.time, data.email]);
}

export const markShowedUp = (db: Pool, eventid: number) => {
  let sqlString = `UPDATE scheduled_events SET showed_up=1 where eventid=?`;
  return makeSqlQuery(db, sqlString, eventid);
}

export const getEventById = (db: Pool, eventid: number) => {
    let sqlString = `SELECT eventid, name, email, date, time, event_data, insertion_time FROM scheduled_events WHERE eventid=?`;
    return makeSqlQuery(db, sqlString, eventid);
}

export const retrieveApiToken = (db: Pool, userId: number) => {
  let sqlString = `SELECT api_token FROM host WHERE userid=?`;
  return makeSqlQuery(db, sqlString, userId);
}

export const getEndpoint = (db: Pool, userId: number) => {
  let sqlString = `SELECT privatedata FROM host WHERE userid=?`;
  return makeSqlQuery(db, sqlString, userId);
}