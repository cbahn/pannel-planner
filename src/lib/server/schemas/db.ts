// src/lib/server/db.ts
import { MongoClient, type Db } from 'mongodb';
import { env } from '$env/dynamic/private';

const MONGO_URI = env.MONGO_URI;
const DB_NAME = env.MONGO_DB_NAME ?? 'myapp';

if (!MONGO_URI) {
	throw new Error('MONGO_URI is not defined in environment variables');
}

type MongoCache = {
	client: MongoClient;
	promise: Promise<MongoClient>;
	db?: Db;
};

const globalForMongo = globalThis as typeof globalThis & {
	_mongo?: MongoCache;
};

const mongo =
	globalForMongo._mongo ??
	(() => {
		const client = new MongoClient(MONGO_URI);
		const promise = client.connect();
		const cache: MongoCache = { client, promise };
		globalForMongo._mongo = cache;
		return cache;
	})();

export async function getDb(): Promise<Db> {
	if (!mongo.db) {
		const client = await mongo.promise;
		mongo.db = client.db(DB_NAME);
	}
	return mongo.db;
}