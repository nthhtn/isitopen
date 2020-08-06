import express from 'express';
import RestaurantModel from '../models/restaurant';

module.exports = (app, db) => {

	const router = express.Router();
	const Restaurant = new RestaurantModel(db);

	router.route('/')
		.get(async (req, res) => {
			try {
				let { page, limit } = req.query;
				page = parseInt(page);
				limit = parseInt(limit);
				const result = await Restaurant.queryByFields({}, limit, limit * (page - 1));
				const count = await Restaurant.countByFields({});
				return res.json({ success: true, result, count, hasMore: count > limit * page });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	app.use('/api/restaurants', router);

};
