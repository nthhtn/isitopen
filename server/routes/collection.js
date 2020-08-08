import express from 'express';
import CollectionModel from '../models/collection';
import RestaurantCollectionModel from '../models/restaurantCollection';

module.exports = (app, db) => {

	const router = express.Router();
	const Collection = new CollectionModel(db);
	const RestaurantCollection = new RestaurantCollectionModel(db);

	router.route('/')
		.get(async (req, res) => {
			try {
				const result = await Collection.queryByFields({ userId: req.user._id });
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})
		.post(async (req, res) => {
			try {
				const result = await Collection.create({ ...req.body, userId: req.user._id });
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	router.route('/:id')
		.get(async (req, res) => {
			try {
				const result = await Collection.read({ _id: req.params.id });
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	router.route('/:id/restaurants')
		.get(async (req, res) => {

		})
		.put(async (req, res) => {

		});

	app.use('/api/collections', router);

};
