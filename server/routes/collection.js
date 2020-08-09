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
				const result = await Collection.read(req.params.id);
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	router.route('/:id/restaurants')
		.get(async (req, res) => {
			try {
				const result = await RestaurantCollection.lookupRestaurant(req.params.id);
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})
		.post(async (req, res) => {
			try {
				const data = req.body.list.map((item) => ({ restaurantId: item, collectionId: req.params.id }));
				await RestaurantCollection.createMany(data);
				return res.json({ success: true });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})
		.delete(async (req, res) => {
			try {
				await RestaurantCollection.deleteMany({ collectionId: req.params.id, restaurantId: { $in: req.body.list } });
				return res.json({ success: true });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	app.use('/api/collections', router);

};
