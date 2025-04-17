import express from 'express';
import userRoutes from './userRoutes.js';

const router = express.Router();

// Use imported routes
router.use('/users', userRoutes);

export default router;
