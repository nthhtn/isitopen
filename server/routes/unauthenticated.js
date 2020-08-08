import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-local';

import { hashPassword, generateSalt } from '../helpers/password';
import UserModel from '../models/user';

module.exports = (app, db) => {

	let router = express.Router();
	const User = new UserModel(db);

	passport.use(new Strategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
		const user = await User.readByEmail(email);
		let guest = null;
		if (!user) {
			let data = {
				email,
				salt: generateSalt()
			};
			data.password = hashPassword(password, data.salt);
			guest = await User.create(data);
		} else if (user.password !== hashPassword(password, user.salt)) {
			return done(null, false, { success: false, error: 'Invalid username/password' });
		}
		return done(null, user || guest);
	}));

	router.route('/login')
		.post((req, res) => {
			passport.authenticate('local', (err, user, info) => {
				if (err) { return res.status(500).json({ success: false, error: err.message }); }
				if (!user) { return res.status(401).json(info); }
				req.login(user, (err) => {
					if (err) { return res.status(500).json({ success: false, error: err.message }); }
					return res.json({ success: true });
				});
			})(req, res);
		});

	app.use('/', router);

};
