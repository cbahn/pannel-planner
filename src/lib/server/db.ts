// src/lib/server/db.ts
import { MongoClient, type Db, type Collection } from 'mongodb';
import { env } from '$env/dynamic/private';

import type { PanelEntity } from '$lib/server/schemas/panel';

// ---- Config ----
const MONGO_URI = env.MONGO_URI;
const DB_NAME = env.MONGO_DB_NAME ?? 'myapp';

if (!MONGO_URI) {
	throw new Error('MONGO_URI is not defined in environment variables');
}

// ---- Singleton connection (re-used across requests in dev) ----
type MongoCache = {
	client: MongoClient;
	connectPromise: Promise<MongoClient>;
	db?: Db;
};

const globalForMongo = globalThis as typeof globalThis & {
	_mongo?: MongoCache;
};

const mongo: MongoCache =
	globalForMongo._mongo ??
	(() => {
		const client = new MongoClient(MONGO_URI);
		const connectPromise = client.connect(); // starts connecting once, then we reuse this promise
		const cache: MongoCache = { client, connectPromise };
		globalForMongo._mongo = cache;
		return cache;
	})();

// ---- Core helpers ----
export async function getDb(): Promise<Db> {
	// Create the Db object once, then reuse it
	if (!mongo.db) {
		const client = await mongo.connectPromise;
		mongo.db = client.db(DB_NAME);
	}
	return mongo.db;
}

// ---- Collection helpers (one function per collection, simple & explicit) ----
export async function getPanelsCollection(): Promise<Collection<PanelEntity>> {
	const db = await getDb();
	return db.collection<PanelEntity>('pannels'); // collection name in MongoDB
}

// If you add more schemas later, you’ll add more functions like this:
//
// import type { UserEntity } from '$lib/server/schemas/user';
// export async function getUsersCollection(): Promise<Collection<UserEntity>> {
//   const db = await getDb();
//   return db.collection<UserEntity>('users');
// }