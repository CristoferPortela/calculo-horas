import {DatabaseConnection} from '../database/conn'
import {Registro} from "../models/Registros";
import {Hora} from "../models/Horas";
import {SQLError, SQLResultSetRowList} from "expo-sqlite";

const db = DatabaseConnection.getConnection()

type Banco = Registro | Hora

const keys = (param: Banco) => Object.keys(param).filter((item) => !item.match(/id|table/))
// @ts-ignore
const values = (param: Banco) => keys(param).map((item) => param[item])

export default class DatabaseService {

    static addData(param: Banco) {
        return new Promise((resolve, reject) =>
            db.transaction(
                tx => {
                    tx.executeSql(
                        `INSERT INTO ${param.table}
                             (${keys(param)})
                         values (${values(param).map(() => '?')})`,
                        [...values(param)],
                        (_, {insertId, rows}) => {
                            console.log("id insert: " + insertId);
                            console.log("rows: " + rows);
                            resolve(insertId)
                        }),
                        (sqlError: SQLError) => {
                            console.log(sqlError);
                        }
                }, (txError) => {
                    console.log(txError);
                }));
    }

    static deleteById(param: Banco) {
        db.transaction(
            tx => {
                tx.executeSql(
                    `delete
                     from ${param.table}
                     where id = ?;`,
                    [param.id],
                    (_, {rows}) => {
                    }),
                    (sqlError: SQLError) => {
                        console.log(sqlError);
                    }
            }, (txError) => {
                console.log(txError);

            });
    }


    static updateById(param: Banco) {
        return new Promise((resolve, reject) =>
            db.transaction(tx => {
                tx.executeSql(
                    `update ${param.table}
                         ${keys(param).map((item) => `set ${item} = ? `)}
                     where id = ?;`,
                    [...values(param), param.id],
                    () => {
                    }), (sqlError: SQLError) => {
                    console.log(sqlError);
                }
            }, (txError) => {
                console.log(txError);

            }));
    }

    static findById(param: Banco) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `select *
                 from ${param.table}
                 where id = ?`,
                [param.id],
                (_, {rows}) => {
                    resolve(rows)
                }), (sqlError: SQLError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }));
    }

    static findByDay(day: string): Promise<SQLResultSetRowList> {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `select *
                 from Registros
                 where dia = ?`,
                [day],
                (_, {rows}) => {
                    resolve(rows)
                }), (sqlError: SQLError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }));
    }

    static findByDayJoin(day: string): Promise<SQLResultSetRowList> {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `select *
                 from Registros
                 JOIN Horas on Horas.registroId = Registros.id
                 where dia = ?`,
                [day],
                (_, {rows}) => {
                    resolve(rows)
                }), (sqlError: SQLError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }));
    }

    static findHoras(registro: number) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `select *
                 from Horas
                 where registroId = ?`,
                [registro],
                (_, {rows}) => {
                    resolve(rows)
                }), (sqlError: SQLError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }));
    }
    static findAll(table: string) {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(
                `select *
                 from ${table}`,
                [],
                (_, {rows}) => {
                    resolve(rows)
                }), (sqlError: SQLError) => {
                console.log(sqlError);
            }
        }, (txError) => {
            console.log(txError);
        }))
    }
}