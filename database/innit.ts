import { DatabaseConnection } from './conn'
import {WebSQLDatabase} from "expo-sqlite";

let db: WebSQLDatabase
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }
    private InitDb() {
        const sql = [
            `CREATE TABLE IF NOT EXISTS Registros (
            id INTEGER PRIMARY KEY autoincrement,
            dia TEXT,
            ativo INTEGER 
            );`,

            `CREATE TABLE IF NOT EXISTS Horas (
            id INTEGER PRIMARY KEY autoincrement,
            registroId INTEGER,
            entrada INTEGER, 
            hora TEXT
            );`,

        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}