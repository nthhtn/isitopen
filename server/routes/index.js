import path from 'path';

import { isLoggedIn } from '../helpers/middleware';

module.exports = (app, db) => {

	require('./unauthenticated')(app, db);

	app.use('/api', isLoggedIn);

	require('./restaurant')(app, db);
	require('./collection')(app, db);
	require('./user')(app, db);

	app.route('/logout')
		.get((req, res) => {
			if (req.isAuthenticated()) { req.logOut(); }
			return res.sendFile(path.resolve(`${__dirname}/../../views/anonymous.html`));
		});

	app.route('*')
		.get((req, res) => {
			const viewpath = req.isAuthenticated() ?
				`${__dirname}/../../views/user.html` : `${__dirname}/../../views/anonymous.html`;
			return res.sendFile(path.resolve(viewpath));
		});

};
