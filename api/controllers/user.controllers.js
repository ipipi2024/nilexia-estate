import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import Listing from "../models/listing.model.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const test = (req,res) => {
    res.json({
        message: 'Hello World!',
    });
}

export const getUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, 'User not found!'));
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch(error) {
        next(error);
    }
}

export const deleteUser = async (req,res,next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');

    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch(error) {
            next(error);
        }
    }else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
}

export const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return next(errorHandler(404, 'User not found!'));

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before storing
        const hashedToken = bcryptjs.hashSync(resetToken, 10);

        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

        await user.save();

        // Send the reset email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `https://nilexia-estate.onrender.com//reset-password/${resetToken}`; // Use the plain token in the URL
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent!' });

    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const token = req.params.token;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetTokenExpiry: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!user || !bcryptjs.compareSync(token, user.resetToken)) {
            return next(errorHandler(400, 'Invalid or expired token!'));
        }

        // Hash the new password
        user.password = bcryptjs.hashSync(newPassword, 10);
        user.resetToken = undefined; // Clear the reset token
        user.resetTokenExpiry = undefined; // Clear token expiry

        await user.save();

        res.status(200).json({ message: 'Password has been reset!' });

    } catch (error) {
        next(error);
    }
};