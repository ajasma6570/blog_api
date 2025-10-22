import User from "@/models/user";
import { body, cookie } from "express-validator";
import bcrypt from 'bcrypt';

export const registerSchema = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isLength({ max: 50 })
        .withMessage('Email must be less than 50 characters')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (value) => {
            const userExists = await User.exists({ email: value });
            if (userExists) {
                throw new Error('User already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('passsword is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters'),
    body('role')
        .optional()
        .isString()
        .withMessage('Role must be string')
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
]

export const loginSchema = [body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
        const userExists = await User.exists({ email: value });
        if (!userExists) {
            throw new Error('User email or password is invalid');
        }
    }),
body('password')
    .notEmpty()
    .withMessage('passsword is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long')
    .custom(async (value, { req }) => {
        const { email } = req.body as { email: string };
        const user = await User.findOne({ email }).select('password').lean().exec();

        if (!user) {
            throw new Error('User email or password is invalid');
        }

        const passwordMatch = await bcrypt.compare(value, user.password);
        if (!passwordMatch) {
            throw new Error('User email or password is invalid');
        }
    }),]

export const refreshTokenSchema = [cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token'),
]