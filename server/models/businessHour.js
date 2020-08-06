/**
 * Collection "businessHour"
 * @param _id:string
 * @param day:number
 * @param openTime:number
 * @param closeTime:number
 */

import { ObjectID } from 'mongodb';

export default class BusinessHourModel {

	constructor(db) {
		this._db = db;
		this._table = 'businessHour';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
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

};
