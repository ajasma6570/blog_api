import jwt from 'jsonwebtoken';
import config from '@/config';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign(
        {
            userId,
        },
        config.JWT_ACCESS_SECRET,
        {
            expiresIn: config.ACCESS_TOKEN_EXPIRY,
            subject: 'accessApi',
        },
    );
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
    return jwt.sign(
        {
            userId,
        },
        config.JWT_REFRESH_SECRET,
        {
            expiresIn: config.REFRESH_TOKEN_EXPIRY,
            subject: 'refreshApi',
        },
    );
};

export const verifyAccessToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as jwt.JwtPayload;
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as jwt.JwtPayload;
};
