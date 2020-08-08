/**
 * Collection "restaurant"
 * @param _id:string
 * @param restaurantName:string
 * @param businessHoursText:string
 */

import { ObjectID } from 'mongodb';

export default class RestaurantModel {

	constructor(db) {
		this._db = db;
		this._table = 'restaurant';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
			await this._db.collection(this._table).createIndex({ restaurantName: 1 }, { unique: true });
			await this._db.collection(this._table).insertOne(data);
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async createMany(list) {
		list = list.map((item) => {
			item._id = new ObjectID().toString();
			return item;
		});
		try {
			await this._db.collection(this._table).insertMany(list);
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async queryByFields(fields = {}, limit = 10, skip = 0) {
		try {
			const result = await this._db.collection(this._table).find(fields).skip(skip).limit(limit).toArray();
			return Promise.resolve(result);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async countByFields(fields = {}) {
		try {
			return await this._db.collection(this._table).find(fields).count();
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

};
