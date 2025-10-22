import mongoose from 'mongoose';

import config from '@/config';

import type { ConnectOptions } from 'mongoose';
import { logger } from '@/lib/adze';
import adze from 'adze';

const clientOptions: ConnectOptions = {
    dbName: 'blog-api',
    appName: 'Blog API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MONGO_URI is not defined in the configuration.');
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);

        // logger.info('Connected to the database successfully.', {
        //     uri: config.MONGO_URI,
        //     options: clientOptions,
        // });

        adze.info('Connected to the database successfully.', {
            uri: config.MONGO_URI,
            options: clientOptions,
        })
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        logger.error('Error connecting to the database', err);
    }
};

export const disconnectFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();

        logger.info('Disconnected from the database successfully.');
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }

        logger.error('Error disconnecting from the database', err);
    }
};
