import { logger } from '@/lib/adze';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt';
import Token from '@/models/tokens';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;

    try {
        const tokenExists = await Token.exists({ token: refreshToken });

        if (!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        const jwtPayload = verifyRefreshToken(refreshToken) as {
            userId: Types.ObjectId;
        };

        const newAccessToken = generateAccessToken(jwtPayload.userId);
        res.status(200).json({
            code: 'Success',
            message: 'Access token refreshed successfully',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token has expired, please login again',
            });
            return;
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token',
            });
            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });

        logger.error('Error during token refresh', err);
    }
};

export default refreshToken;
