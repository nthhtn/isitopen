/**
 * Collection "user"
 * @param _id:string
 * @param email:string
 * @param password:string
 * @param salt:string
 */

import { ObjectID } from 'mongodb';

export default class UserModel {

	constructor(db) {
		this._db = db;
		this._table = 'user';
	}

	async create(data) {
		data._id = new ObjectID().toString();
		try {
			await this._db.collection(this._table).createIndex({ email: 1 }, { unique: true });
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

	async readByEmail(email) {
		try {
			return await this._db.collection(this._table).findOne({ email });
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

	async queryByFields(fields = {}) {
		try {
			const result = await this._db.collection(this._table).find(fields, { projection: { password: 0, salt: 0 } }).toArray();
			return await result;
		} catch (error) {
			return Promise.reject(error.message);
		}
	}

};
