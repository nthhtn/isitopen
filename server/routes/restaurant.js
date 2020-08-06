import express from 'express';
import RestaurantModel from '../models/restaurant';

module.exports = (app, db) => {

	const router = express.Router();
	const Restaurant = new RestaurantModel(db);

	router.route('/')
		.get(async (req, res) => {
			try {
				const result = await Restaurant.queryByFields({});
				console.log(result);
				return res.json({ success: true, result, count: result.length, hasMore: false });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	app.use('/api/restaurants', router);

};
