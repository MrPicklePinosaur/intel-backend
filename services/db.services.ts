
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB('database.db');
db.close();

// used for initially populating the database from csv files
export const populate() => {

}

export const init() => {
// CREATE TABLE GraduateGroup(
//     id integer primary key autoincrement,
//     gender integer,
//     agegroup integer,
//     fos integer,
//     education integer,
//     count integer,
//     income integer
// );
}

