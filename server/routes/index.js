import path from 'path';

module.exports = (app, db) => {

	require('./restaurant')(app, db);

	app.route('*')
		.get((req, res) => {
			const viewpath = `${__dirname}/../../views/index.html`;
			return res.sendFile(path.resolve(viewpath));
		});

};
