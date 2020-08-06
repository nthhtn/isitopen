import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import webpack from 'webpack';
import { MongoClient } from 'mongodb';

import { db_url, db_name } from './config/mongodb';

const port = 4444;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static(`${__dirname}/static`));

app.use(morgan('dev'));

import config from './webpack.config';
const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

MongoClient.connect(db_url, async (err, client) => {
	if (err) { throw err; }
	const db = await client.db(db_name);
	require('./server/routes')(app, db);
	await require('./server/helpers/init')(db);
	app.listen(port, () => console.log(`App is listening on port ${port}`));
});
