import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 60, // Max 60 requests per IP per window (10 mins)
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        error: 'you have sent too many requests in a given amount of time. please try again later.'
    }
});


export default limiter;