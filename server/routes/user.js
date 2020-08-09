import express from 'express';
import UserModel from '../models/collection';

module.exports = (app, db) => {

	const router = express.Router();
	const User = new UserModel(db);

	router.route('/')
		.get(async (req, res) => {
			try {
				const result = await User.queryByFields({});
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	router.route('/me')
		.get(async (req, res) => {
			try {
				const { _id, email } = req.user;
				const result = { _id, email };
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})

	app.use('/api/users', router);

};
