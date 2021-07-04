import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB('database.db');
db.close();

// CREATE TABLE GraduateGroup(
//     id integer primary key autoincrement,
//     gender integer,
//     agegroup integer,
//     fos integer,
//     education integer,
//     count integer,
//     income integer
// );

// used for initially populating the database from csv files
export const populate() => {

}
