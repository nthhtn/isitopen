/**
 * Collection "collection"
 * @param _id:string
 * @param collectionName:string
 * @param userId:string
 */

import { ObjectID } from 'mongodb';

export default class CollectionModel {

	constructor(db) {
		this._db = db;
		this._table = 'collection';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
			await this._db.collection(this._table).createIndex({ collectionName: 1, userId: 1 }, { unique: true });
			await this._db.collection(this._table).insertOne(data);
			return Promise.resolve(data);
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async read(id) {
		try {
			return this._db.collection(this._table).findOne({ _id: id });
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

};
