import express from 'express';
import mime from 'mime';

import RestaurantModel from '../models/restaurant';
import BusinessHourModel from '../models/businessHour';
import RestaurantCollectionModel from '../models/restaurantCollection';
import { importFromCsv } from '../helpers/import';

const multipart = require('connect-multiparty')();

module.exports = (app, db) => {

	const router = express.Router();
	const Restaurant = new RestaurantModel(db);
	const BusinessHour = new BusinessHourModel(db);
	const RestaurantCollection = new RestaurantCollectionModel(db);

	router.route('/')
		.get(async (req, res) => {
			try {
				let { page, limit, q, time, days, not } = req.query;
				let hour_fields = Object.assign({});
				if (days) {
					hour_fields.day = { $in: days.split(',').map((day) => (parseInt(day))) };
				}
				if (time) {
					hour_fields.openTime = { $lte: parseInt(time) };
					hour_fields.closeTime = { $gte: parseInt(time) };
				}
				if (not) {
					hour_fields.restaurantId = { $nin: not.split(',') };
				}
				const ids = await BusinessHour.queryDistinct('restaurantId', hour_fields);
				page = page ? parseInt(page) : 1;
				limit = limit ? parseInt(limit) : 20;
				let restaurant_fields = { _id: { $in: ids }, restaurantName: { $regex: new RegExp(q, 'gi') } };
				if (not) {
					restaurant_fields._id['$nin'] = not.split(',');
				}
				const result = await Restaurant.queryByFields(restaurant_fields, limit, limit * (page - 1));
				const count = await Restaurant.countByFields(restaurant_fields);
				return res.json({ success: true, result, count, hasMore: count > limit * page });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})
		.post(multipart, async (req, res) => {
			const file = req.files['import-file'];
			if (!file) { res.status(400).json({ success: false, error: 'File not found' }); }
			if (!file.size) { { res.status(400).json({ success: false, error: 'Invalid file size' }); } }
			const validFileTypes = ['text/csv'];
			if (validFileTypes.indexOf(mime.getType(file.path)) === -1) { { res.status(400).json({ success: false, error: 'Invalid file type' }); } }
			importFromCsv(db, file.path);
			res.json({ success: true });
		});

	router.route('/:id/collections')
		.get(async (req, res) => {
			try {
				const result = await RestaurantCollection.lookupCollection(req.params.id);
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		})
		.put(async (req, res) => {
			try {
				const data = req.body.list.map((item) => ({ restaurantId: req.params.id, collectionId: item }));
				await RestaurantCollection.deleteMany({ restaurantId: req.params.id });
				let result = 0;
				if (data.length > 0) {
					result = await RestaurantCollection.createMany(data);
				}
				return res.json({ success: true, result });
			} catch (error) {
				return res.status(400).json({ success: false, error: error.message });
			}
		});

	app.use('/api/restaurants', router);

};
