
import { DB } from "https://deno.land/x/sqlite/mod.ts";

export var sqliteClient: DB;

export const databaseOpen = () => {
    sqliteClient = new DB('database.db');
    console.log('database connection opened');
}

export const databaseClose = () => {
    sqliteClient.close();
    console.log('database closed sucessfully');
}

// performs basic query on database using the input fields
export const queryGraduateGroup = async (fos: number, agegroup: number, gender: number, education: number) => sqliteClient.query(
    'SELECT * FROM GraduateGroup WHERE fos = ? AND agegroup = ? AND gender = ? AND education = ?', [fos, agegroup, gender, education] 
);

// used to create table from scratch
export const initGraduateGroup = async () => sqliteClient.query(
    `CREATE TABLE GraduateGroup(
        id integer primary key autoincrement,
        gender integer,
        agegroup integer,
        fos integer,
        datayear integer,
        education integer,
        count integer,
        income integer
    )`
);
