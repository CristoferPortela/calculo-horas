import FileSystem from 'expo-file-system'
import {Asset} from 'expo-asset'
import SQLite from 'expo-sqlite'

/**
 * Opens a database
 * @param pathToDatabaseFile
 * @param dbname
 */
export async function openDatabase(pathToDatabaseFile: string, dbname: string): Promise<SQLite.WebSQLDatabase> {
    if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
    }
    await FileSystem.downloadAsync(
        Asset.fromModule(require(pathToDatabaseFile)).uri,
        FileSystem.documentDirectory + `SQLite/${dbname}.db`
    );
    return SQLite.openDatabase('myDatabaseName.db');
}
