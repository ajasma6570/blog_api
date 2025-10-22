import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import type { CorsOptions } from 'cors';

import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';

import v1Routes from '@/routes/v1';
import { logger } from '@/lib/adze';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
    compression({
        threshold: 1024, // only compress responses larger than 1KB
    }),
);

app.use(helmet());

app.use(limiter);

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (
            config.NODE_ENV === 'development' ||
            !origin ||
            config.WHITELIST_ORIGINS.includes(origin)
        ) {
            callback(null, true);
        } else {
            callback(
                new Error(`CORS error: ${origin} is not allowed by CORS`),
                false,
            );
            logger.warn(`CORS error: ${origin} is not allowed by CORS`);
        }
    },
};

app.use(cors(corsOptions));

(async () => {
    try {
        await connectToDatabase();
        app.use('/api/v1/', v1Routes);

        app.listen(config.PORT, () => {
            logger.info(`Server is running: http://localhost:${config.PORT}`);
        });
    } catch (err) {
        logger.error('Failed to start the server', err);
        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

const handleServerShutdown = async () => {
    try {
        await disconnectFromDatabase();
        logger.info('Server shutdown');
        process.exit(0);
    } catch (err) {
        logger.error('Error during server shutdown', err);
        process.exit(1);
    }
};

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
