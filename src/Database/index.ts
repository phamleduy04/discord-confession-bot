import 'dotenv/config';
import Keyv from 'keyv';

const db = new Keyv(process.env.DATABASE_URL || 'sqlite://confession.sqlite');

const getConfessionCount = async () : Promise<number> => {
    let count = 0;
    for await (const [key, value] of db.iterator()) {
        if (key && key.startsWith('confession')) count++;
    };

    return count;
}

const pushConfession = async (confession: Confession): Promise<void> => {
    const cfsCount = await getConfessionCount();
    await db.set(`confession-${cfsCount + 1}`, confession);
}

const getConfession = async (messageID: string): Promise<Confession | undefined> => {
    for await (const [key, value] of db.iterator()) {
        if (value.reviewMessageID == messageID || value.messageID == messageID) return value;
    };
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