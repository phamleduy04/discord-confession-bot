import type { Collection as MongoCollection, ClientSession } from 'mongodb';

export class Collection {
    constructor(public collection: MongoCollection, public session: ClientSession) {
        this.collection = collection;
        this.session = session;
    }

    async has(key: string): Promise<boolean> {
        if (!key) throw new Error('Key is required');
        try {
            const data = (await this.collection.findOne({ ID: key })) || undefined;
            return typeof data !== 'undefined';
        } catch {
            return false;
        }
    };

    async get(key: string): Promise<any> {
        if (!key) throw new Error('Key is required');
        const { data } = (await this.collection.findOne({ ID: key })) || { data: null };
        return data;
    }

    async set(key: string, value:any): Promise<any> {
        if (!key) throw new Error('Key is required');
        if (value === undefined || value === null) throw new Error('Value is required');
        const data = await this.collection.updateOne({ ID: key }, { $set: { data: value }}, { upsert: true });
        if (data.modifiedCount > 0 || data.upsertedCount > 0) return data;
    }

    async delete(key: string): Promise<boolean> {
        if (!key) throw new Error('Key is required');
        const data = await this.collection.deleteOne({ ID: key });
        if (data.deletedCount > 0) return true;
        return false;
    }

    async all(): Promise<any> {
        return await this.collection.find({}, { session: this.session }).toArray();
    }
}