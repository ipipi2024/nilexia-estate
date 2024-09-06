import express from 'express';
import { deleteUser, getUser, getUserListings, requestPasswordReset, resetPassword, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id',verifyToken, getUser);
router.post('/request-password-reset', requestPasswordReset); // Request reset link
router.post('/reset-password/:token', resetPassword); // Reset password with token
export default router;