import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import webpack from 'webpack';
import { MongoClient } from 'mongodb';
import passport from 'passport';

import { db_url, db_name } from './config/mongodb';
import { port } from './config/host';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static(`${__dirname}/static`));

app.use(morgan('dev'));

app.use(session({
	secret: 'isitopen',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	console.log('serialize');
	// console.log(user);
	return done(null, user);
});

passport.deserializeUser((user, done) => {
	console.log('deserialize');
	return done(null, user);
});

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
	app.listen(port, () => console.log(`App is listening on port ${port}`));
});
