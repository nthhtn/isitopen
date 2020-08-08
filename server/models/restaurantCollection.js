/**
 * Collection "restaurantCollection"
 * @param _id:string
 * @param restaurantId:string
 * @param collectionId:string
 */

import { ObjectID } from 'mongodb';

export default class RestaurantCollectionModel {

	constructor(db) {
		this._db = db;
		this._table = 'restaurantCollection';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
			await this._db.collection(this._table).createIndex({ restaurantId: 1, collectionId: 1 }, { unique: true });
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
			await this._db.collection(this._table).createIndex({ restaurantId: 1, collectionId: 1 }, { unique: true });
			await this._db.collection(this._table).insertMany(list, { ordered: false });
			return Promise.resolve(list);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async deleteMany(fields = {}) {
		try {
			await this._db.collection(this._table).deleteMany(fields);
			return Promise.resolve();
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async lookupCollection(restaurantId) {
		const lookup = {
			from: 'collection',
			let: { collectionId: '$collectionId' },
			pipeline: [
				{ $match: { $expr: { $eq: ['$_id', '$$collectionId'] } } },
				{ $project: { collectionName: 1 } }
			],
			as: 'collections'
		};
		const aggregate = [{ $match: { restaurantId } }, { $lookup: lookup }, { $unwind: { path: '$collections', preserveNullAndEmptyArrays: true } }];
		try {
			const result = await this._db.collection(this._table).aggregate(aggregate).toArray();
			return result.map((item) => (item.collections));
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

};
