require('dotenv').config();

const db_url = process.env.MONGODB_URL;
const db_name = db_url.split('/')[3];

module.exports = { db_url, db_name };
