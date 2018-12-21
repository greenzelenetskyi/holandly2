import { Pool, MysqlError } from 'mysql';

const makeSqlQueryString = (db: Pool, sqlString: string, params?: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        db.query(sqlString, params, (err: MysqlError, result: string) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    })
}

export const getUserEvents = (db: Pool, userName: string) => {
    let sqlString = `SELECT publicdata AS userEvents 
    FROM holandly.host WHERE username = ?`;
    return makeSqlQueryString(db, sqlString, userName)
}

//  *******************  Used types  ***********************************************
//  *******************  End of used types  ****************************************
