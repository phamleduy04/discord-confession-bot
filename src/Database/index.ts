import { MongoClient } from 'mongodb';
import { Collection } from './collection';
import 'dotenv/config';

const mongo: MongoClient = new MongoClient(process.env.MONGODB || 'mongodb://localhost/cfs');
let mongoCollection;
let db: Collection;
mongo.connect().then(() => {
    console.log('Connected to MongoDB');
    mongoCollection = mongo.db().collection('cfs');
    db = new Collection(mongoCollection, mongo.startSession())
});

const getConfessionCount = async () : Promise<number> => {
    return await db.all().then(confessions => confessions.filter((el: { ID: string, data: Confession[]}) => el.ID.startsWith('confession')).length);
}

const pushConfession = async (confession: Confession): Promise<void> => {
    const cfsCount = await getConfessionCount();
    await db.set(`confession-${cfsCount + 1}`, confession);
}

const getConfession = async (messageID: string): Promise<Confession> => {
    const all = await db.all();
    const confession = all.find((el: { ID: string, data: Confession }) => el.data.reviewMessageID == messageID || el.data.messageID == messageID);
    return confession?.data;
}

const updateConfession = async (confession: Confession): Promise<void> => {
    await db.set(`confession-${confession.id}`, confession);
}

export {
    getConfessionCount,
    pushConfession,
    getConfession,
    updateConfession,
}

export interface Confession {
    id: number;
    content: string;
    reviewMessageID: string;
    author: string;
    createdAt: Date;
    reviewedBy: string | null;
    reviewedAt: Date | null;
    status: 'pending' | 'approved' | 'rejected';
    messageID: string | null;
    threadID: string | null;
}