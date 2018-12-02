import mysql, { Pool, MysqlError } from 'mysql';

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

export const updateConfig = (db: Pool, config: JSON, publicData: any, secureData: any, userId: number) => {
    console.log(config)
    let sqlString = `UPDATE host SET ?`;
    return makeSqlQuery(db, sqlString
      , {
          configuration: JSON.stringify(config), 
          publicdata: JSON.stringify(publicData),
          privatedata: JSON.stringify(secureData),
          userid: userId
        }
    );
}

export const getConfigData = (db: Pool, field: string, userid: number) => {
  let sqlString = `select ?? from host where userid=?`;
  return makeSqlQuery(db, sqlString, [field, userid]);
}